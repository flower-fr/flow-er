const moment = require("moment")

const { insert } = require("../model/insert")

const registerHistory = async ({ req }, context, rows, { sql }) => {

    /**
     * Save message to send
     */

    for (let row of req.body.rows) {

        const data = {
            status: "done",
            chanel: row.chanel,
            direction: "outbound",
            account_id: row.id,
            summary: `${ context.translate("Message sent") } - ${row.summary}`
        }
        if (row.scheduled_at && row.scheduled_at !== "") data.touched_at = row.scheduled_at
        await sql.execute({ context, type: "insert", entity: "crm_contact", data })
    }
}

module.exports = {
    registerHistory
}