const moment = require("moment")

const { insert } = require("../model/insert")

const registerSms = async ({ req }, context, rows, { connection, sms }) => {

    /**
     * Save message to send
     */

    let model
    for (let row of req.body.rows) {

        model = context.config["interaction/model"]
        let message = []
        for (let split of row.sms.split("{")) {
            const split2 = split.split("}")
            if (split2.length == 2) {
                let [propertyId, rest] = split2
                if (propertyId == "prenom") propertyId = "n_first"
                message.push(`${ row[propertyId] }${rest}`)
            }
            else message.push(split)
        }
        message = message.join("")

        let data = {
            status: (row.scheduled_at && row.scheduled_at !== "") ? "new" : "current",
            provider: "api.smspartner.fr",
            endpoint: "/v1/send",
            method: "POST",
            body: JSON.stringify({ SMSList: [{ phoneNumber: row.tel_cell, message: message }] })
        }
        if (row.scheduled_at && row.scheduled_at !== "") data.scheduled_at = row.scheduled_at
        const [insertedRow] = (await connection.execute(insert(context, "interaction", data, model)))
        row.insertId = insertedRow.insertId   

        /**
         * Insert a note
         */

        model = context.config["crm_contact/model"]
        data = {
            status: "done",
            chanel: "sms",
            direction: "outbound",
            account_id: row.id,
            summary: `${ context.translate("SMS sent") } - ${ row.summary }`
        }
        if (row.scheduled_at && row.scheduled_at !== "") data.touched_at = row.scheduled_at
        await connection.execute(insert(context, "crm_contact", data, model))
    }
}

module.exports = {
    registerSms
}