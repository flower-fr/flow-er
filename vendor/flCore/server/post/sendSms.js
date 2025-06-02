const moment = require("moment")

const { select } = require("../model/select")
const { update } = require("../model/update")

const { throwBadRequestError } = require("../../../../core/api-utils")

const sendSms = async ({ req }, context, rows, { connection, sms }) => {

    const model = context.config["interaction/model"]
    
    /**
     * Send the batch of messages
     */

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
        
                /**
                 * Mark for each message the interaction as OK
                 */

                await connection.execute(update(context, "interaction", [row.insertId], { "status": "ok" }, model))
            }
            catch (err) {
                
                /**
                 * Mark the interaction as KO
                 */
        
                await connection.execute(update(context, "interaction", [row.insertId], { "status": "ko" }, model))
            }
        }
    }
}

const resendSms = async ({ context, connection, smsClient, ids }) => {

    /**
     * Retrieve the interactions as sms to send
     */

    const model = context.config["interaction/model"]
    const where = { "status": "current", "provider": "api.smspartner.fr" }
    if (ids) where.id = ids
    const rows = (await connection.execute(select(context, "interaction", ["id", "scheduled_at", "body"], where, null, 500, model)))[0]
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
console.log(body)
        if (selectedIds.length > 0) {
            const response = await fetch("https://api.smspartner.fr/v1/bulk-send", {
                method: "POST",
                headers: new Headers({"content-type": "application/json"}),
                body: JSON.stringify(body)
            })
console.log(response)
            await connection.execute(update(context, "interaction", [selectedIds], { status: (response.status === 200) ? "ok" : "ko" }, model))
        }

        await connection.commit()
        await connection.release()
    }
    catch {
        if (selectedIds.length > 0) await connection.execute(update(context, "interaction", [selectedIds], { status: "ko" }, model))
        await connection.rollback()
        await connection.release()
        throw throwBadRequestError()
    }
}

module.exports = {
    sendSms,
    resendSms
}