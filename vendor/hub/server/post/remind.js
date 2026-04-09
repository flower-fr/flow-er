const moment = require("moment")

const { throwBadRequestError } = require("../../../../core/api-utils")

const registerReminders = async (context, entity, date, viewModel, sql) => {

    /**
     * Retrieve the data
     */

    const dataModel = context.config[`${entity}/model`]
    const where = viewModel.where, columns = Object.keys(viewModel.properties)
    where.date = ["<=", date]
    const rows = await sql.execute({ context, type: "select", entity, columns, where })

    /**
     * Split by owner
     */

    const owners = {}
    for (const row of rows) {
        if (row[viewModel.key] && row.owner_notifications == "email") {
            if (!owners[row[viewModel.key]]) owners[row[viewModel.key]] = []
            owners[row[viewModel.key]].push(row)    
        }
    }

    /**
     * Format one notification per owner
     */

    const reminders = []
    for (const rows of Object.values(owners)) {
        const template = context.localize(viewModel.body).split("{")
        const text = []
        let first = true
        for (const comp of template) {
            if (first) {
                text.push(comp)
                first = false
                continue
            }
            const [v, t] = comp.split("}")
            const value = (v === "date") ? moment(rows[0][v]).format("DD/MM/YYYY") : ((rows[0][v]) ? rows[0][v] : "")
            text.push(`${value}${t}`)    
        }
    
        text.push("<br>\n<br>\n")
    
        for (const row of rows) {
            const template = context.localize(viewModel.rowBody).split("{")
            const rowText = []
            let first = true
            for (const comp of template) {
                if (first) {
                    rowText.push(comp)
                    first = false
                    continue
                }
                const [v, t] = comp.split("}")
                const value = (v === "date") ? moment(row[v]).format("DD/MM/YYYY") : ((row[v]) ? row[v] : "")
                rowText.push(`${value}${t}`)    
            }
            text.push(rowText.join("") + "<br>\n<br>\n")
        }
    
        let data = {
            status: "new",
            provider: "smtp",
            endpoint: "sendMail",
            method: "POST",
            params: { "type": "html", "to": rows[0][viewModel.to], "subject": context.localize(viewModel.subject) },
            body: text.join("")
        }
        data.id = await sql.execute({ context, type: "insert", entity: "interaction", data })
        reminders.push(data)
    }

    return reminders
}

const sendReminders = async (context, reminders, sql, mailClient) =>
{
    const model = context.config["interaction/model"]
    for (let reminder of reminders) {

        const params = JSON.parse(reminder.params)

        try {
            await mailClient.sendMail({
                type: params.type,
                to: params.to,
                subject: params.subject,
                content: reminder.body
            })
            await sql.execute({ context, type: "update", entity: "interaction", ids: [reminder.id], data: { "status": "ok" }})
        }
        catch (err) {
            await sql.execute({ context, type: "update", entity: "interaction", ids: [reminder.insertId], data: { "status": "ko" }})
            throw throwBadRequestError()
        }
    }
}

module.exports = {
    registerReminders,
    sendReminders
}