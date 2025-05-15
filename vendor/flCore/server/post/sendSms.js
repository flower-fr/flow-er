const { update } = require("../model/update")

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

module.exports = {
    sendSms
}