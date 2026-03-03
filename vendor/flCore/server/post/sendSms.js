const moment = require("moment")
const { throwBadRequestError } = require("../../../../core/api-utils")

const sendSms = async ({ req }, context, rows, { sql, sms }) =>
{
    for (let row of rows) {
        if (!row.scheduled_at || row.scheduled_at === "") {

            try {

                const body = []
                for (let split of row.sms.split("{")) {
                    const split2 = split.split("}")
                    if (split2.length == 2) {
                        const [propertyId, rest] = split2
                        body.push(`${ row[propertyId] }${rest}`)
                    }
                    else body.push(split)
                }
        
                await fetch("https://rest.nexmo.com/sms/json", {
                    method: "POST",
                    body: new URLSearchParams({
                        "from": sms.from,
                        "text": body.join(""),
                        "to": "33629879002", //row.tel_cell,
                        "api_key": sms.apiKey,
                        "api_secret": sms.apiSecret
                    })
                })

                await sql.execute({ context, type: "update", entity: "interaction", ids: [row.insertId], data: { "status": "ok" }})
            }
            catch (err) {
                await sql.execute({ context, type: "update", entity: "interaction", ids: [row.insertId], data: { "status": "ko" }})
            }
        }
    }
}

const resendSms = async ({ context, sql, smsClient, ids }) => {

    /**
     * Retrieve the interactions as sms to send
     */

    const model = context.config["interaction/model"]
    const where = { "status": "current", "provider": "api.smspartner.fr" }
    if (ids) where.id = ids
    const rows = await sql.execute({ context, type: "select", entity: "interaction", columns: ["id", "scheduled_at", "body"], where, limit: 500 })
    ids = []
    for (let row of rows) ids.push(row.id)

    const selectedIds = []
    try {
        const body = { apiKey: smsClient.apiSecret, sender: smsClient.sender, SMSList: [] }
        if (smsClient.sandbox) body.sandbox = 1
        for (let row of rows)
        {
            if (!row.scheduled_at || moment(row.scheduled_at).format("YYYY-MM-DD HH:mm:ss") < moment().format("YYYY-MM-DD HH:mm:ss")) {
                const rowBody = JSON.parse(row.body)
                body.SMSList.push(rowBody.SMSList[0])
                selectedIds.push(row.id)
            }
        }

        if (selectedIds.length > 0) {
            const response = await fetch("https://api.smspartner.fr/v1/bulk-send", {
                method: "POST",
                headers: new Headers({"content-type": "application/json"}),
                body: JSON.stringify(body)
            })
            await sql.execute({ context, type: "update", entity: "interaction", ids: [selectedIds], data: { status: (response.status === 200) ? "ok" : "ko" }})
        }

        await sql.commit()
    }
    catch {
        if (selectedIds.length > 0) await sql.execute({ context, type: "update", entity: "interaction", ids: [selectedIds], data: { status: "ko" }})
        await sql.rollback()
        throw throwBadRequestError()
    }
}

module.exports = {
    sendSms,
    resendSms
}