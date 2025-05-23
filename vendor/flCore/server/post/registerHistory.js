const moment = require("moment")

const { insert } = require("../model/insert")

const registerHistory = async ({ req }, context, rows, { connection }) => {

    /**
     * Save message to send
     */

    let model
    for (let row of req.body.rows) {

        let body = []
        for (let split of row.description.split("{")) {
            const split2 = split.split("}")
            if (split2.length == 2) {
                let [propertyId, rest] = split2
                if (propertyId == "prenom") propertyId = "n_first"
                body.push(`${ row[propertyId] }${rest}`)
            }
            else body.push(split)
        }
        body = body.join("")

        model = context.config["crm_contact/model"]
        const data = {
            status: "done",
            chanel: "message",
            direction: "outbound",
            account_id: row.id,
            summary: `${ context.translate("Message sent") } - ${row.summary}`
        }
        if (row.scheduled_at && row.scheduled_at !== "") data.touched_at = row.scheduled_at
        await connection.execute(insert(context, "crm_contact", data, model))
    }
}

module.exports = {
    registerHistory
}