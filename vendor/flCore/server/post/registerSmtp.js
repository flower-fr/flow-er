const { insert } = require("../../../flCore/server/model/insert")
const { renderMail } = require("../view/renderMail")

const registerSmtp = async ({ req }, context, rows, { db }) => {

    const type = "html"
    const model = context.config["interaction/model"]

    /**
     * Save message to send
     */

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
                [propertyId, html] = split2
                email_body.push(`${ row[propertyId] }${html}`)
            }
            else email_body.push(split)
        }
        mailData.body = email_body.join("")
        
        row.email_body = renderMail({ context }, mailData)

        const data = {
            status: "new",
            provider: "smtp",
            endpoint: "sendMail",
            method: "POST",
            params: { "type": type, "to": row.email, "subject": row.email_subject },
            body: row.email_body
        }
        const [insertedRow] = (await db.execute(insert(context, "interaction", data, model)))
        row.insertId = insertedRow.insertId   
    }
}

module.exports = {
    registerSmtp
}