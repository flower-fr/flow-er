const moment = require("moment")

const { insert } = require("../model/insert")
const { renderMail } = require("../view/renderMail")

const registerSmtp = async ({ req }, context, rows, { connection }) => {

    /**
     * Save message to send
     */

    const type = "html"

    for (let row of req.body.rows) {

        const mailData = {
            preHeader: row.email_subject,
            body: row.email_body,
            contact_1_id: row.contact_1_id,
            email: row.email
        }

        const email_body = []
        for (let split of row.email_body.split("{")) {
            const split2 = split.split("}")
            if (split2.length == 2) {
                let [propertyId, html] = split2
                if (propertyId == "prenom") propertyId = "n_first"
                email_body.push(`${ row[propertyId] }${html}`)
            }
            else email_body.push(split)
        }
        mailData.body = email_body.join("")
        row.email_body = mailData.body // renderMail({ context }, mailData)

        const params = { "type": type, "to": row.email, "subject": row.email_subject }
        if (row.cc) params.cc = row.cc
        if (row.cci) params.cci = row.cci
        let data = {
            status: (row.scheduled_at && row.scheduled_at !== "") ? "new" : "current",
            provider: "smtp",
            endpoint: "sendMail",
            method: "POST",
            params,
            body: row.email_body,
            attachments: row.attachments
        }
        if (row.scheduled_at && row.scheduled_at !== "") data.scheduled_at = row.scheduled_at
        const [insertedRow] = (await connection.execute(insert(context, "interaction", data, context.config["interaction/model"])))
        row.insertId = insertedRow.insertId   

        /**
         * Insert a note
         */

        data = {
            status: "done",
            chanel: "email",
            direction: "outbound",
            account_id: row.id,
            summary: `${ context.translate("Email sent") } - ${row.email_subject}`
        }
        if (row.scheduled_at && row.scheduled_at !== "") data.touched_at = row.scheduled_at
        await connection.execute(insert(context, "crm_contact", data, context.config["crm_contact/model"]))
    }
}

module.exports = {
    registerSmtp
}