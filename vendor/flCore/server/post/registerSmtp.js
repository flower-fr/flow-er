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
                const [propertyId, html] = split2
                email_body.push(`${ row[propertyId] }${html}`)
            }
            else email_body.push(split)
        }
        mailData.body = email_body.join("")
        row.email_body = mailData.body // renderMail({ context }, mailData)

        let data = {
            status: "new",
            provider: "smtp",
            endpoint: "sendMail",
            method: "POST",
            params: JSON.stringify({ "type": type, "to": row.email, "subject": row.email_subject }),
            body: row.email_body
        }
        const [insertedRow] = (await connection.execute(insert(context, "interaction", data, context.config["interaction/model"])))
        row.insertId = insertedRow.insertId   

        /**
         * Insert a note
         */

        data = {
            status: "done",
            date: moment().format("YYYY-MM-DD"),
            time: moment().format("HH:mm:ss"),
            chanel: "email",
            direction: "outbound",
            account_id: row.id,
            summary: `${ context.translate("Email sent") } - ${row.email_subject}`
        }
        await connection.execute(insert(context, "crm_contact", data, context.config["crm_contact/model"]))
    }
}

module.exports = {
    registerSmtp
}