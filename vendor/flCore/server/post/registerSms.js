const { insert } = require("../model/insert")

const registerSms = async ({ req }, context, rows, { connection, sms }) => {

    /**
     * Save message to send
     */

    let model
    for (let row of req.body.rows) {

        model = context.config["interaction/model"]
        let body = []
        for (let split of row.sms.split("{")) {
            const split2 = split.split("}")
            if (split2.length == 2) {
                let [propertyId, rest] = split2
                if (propertyId == "prenom") propertyId = "n_first"
                body.push(`${ row[propertyId] }${rest}`)
            }
            else body.push(split)
        }
        body = body.join("")

        let data = {
            status: "new",
            provider: "rest.nexmo.com",
            endpoint: "/sms/json",
            method: "POST",
            params: JSON.stringify({ "from": sms.from, "text": body, "to": row.tel_cell, "api_key": sms.apiKey, "api_secret": sms.apiSecret })
        }
        const [insertedRow] = (await connection.execute(insert(context, "interaction", data, model)))
        row.insertId = insertedRow.insertId   

        /**
         * Insert a note
         */

        model = context.config["crm_contact/model"]
        data = {
            chanel: "sms",
            direction: "outbound",
            account_id: row.id,
            text: body
        }
        await connection.execute(insert(context, "crm_contact", data, model))
    }
}

module.exports = {
    registerSms
}