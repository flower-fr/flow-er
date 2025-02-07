const { insert } = require("../model/insert")

const registerSms = async ({ req }, context, rows, { connection, sms }) => {

    const model = context.config["interaction/model"]

    /**
     * Save message to send
     */

    for (let row of req.body.rows) {

        const body = []
        for (let split of row.sms.split("{")) {
            const split2 = split.split("}")
            if (split2.length == 2) {
                const [propertyId, rest] = split2
                body.push(`${ row[propertyId] }${rest}`)
            }
            else body.push(split)
        }

        const data = {
            status: "new",
            provider: "rest.nexmo.com",
            endpoint: "/sms/json",
            method: "POST",
            params: JSON.stringify({ "from": sms.from, "text": body.join(""), "to": row.tel_cell, "api_key": sms.apiKey, "api_secret": sms.apiSecret })
        }
        const [insertedRow] = (await connection.execute(insert(context, "interaction", data, model)))
        row.insertId = insertedRow.insertId   
    }
}

module.exports = {
    registerSms
}