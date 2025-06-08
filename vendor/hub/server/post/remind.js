const { select } = require("../../../flCore/server/model/select")
const { insert } = require("../../../flCore/server/model/insert")
const { update } = require("../../../flCore/server/model/update")
const moment = require("moment")

const { throwBadRequestError } = require("../../../../core/api-utils")

const registerReminders = async (context, entity, date, viewModel, connection) => {

    /**
     * Retrieve the data
     */

    const dataModel = context.config[`${entity}/model`]
    const where = viewModel.where
    where.date = ["<=", date]
    const [rows] = await connection.execute(select(context, entity, Object.keys(viewModel.properties), where, null, null, dataModel))

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
            params: JSON.stringify({ "type": "html", "to": rows[0][viewModel.to], "subject": context.localize(viewModel.subject) }),
            body: text.join("")
        }
        const [insertedRow] = (await connection.execute(insert(context, "interaction", data, context.config["interaction/model"])))
        data.id = insertedRow.insertId
        reminders.push(data)
    }

    return reminders
}

const sendReminders = async (context, reminders, connection, mailClient) => {

    const model = context.config["interaction/model"]
    
    /**
     * Send the batch of messages
     */

    for (let reminder of reminders) {

        const params = JSON.parse(reminder.params)

        try {
            await mailClient.sendMail({
                type: params.type,
                to: params.to,
                subject: params.subject,
                content: reminder.body
            })
    
            /**
             * Mark for each message the interaction as OK
             */

            await connection.execute(update(context, "interaction", [reminder.id], { "status": "ok" }, model))
            await connection.release()
        }
        catch (err) {
                
            /**
             * Mark the interaction as KO
             */

            await connection.execute(update(context, "interaction", [reminder.insertId], { "status": "ko" }, model))
            await connection.release()
            throw throwBadRequestError()
        }
    }
}

module.exports = {
    registerReminders,
    sendReminders
}