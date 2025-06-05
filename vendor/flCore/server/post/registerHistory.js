const moment = require("moment")

const { insert } = require("../model/insert")

const registerHistory = async ({ req }, context, rows, { connection }) => {

    /**
     * Save message to send
     */

    let model
    for (let row of req.body.rows) {

        model = context.config["crm_contact/model"]
        const data = {
            status: "done",
            chanel: row.chanel,
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