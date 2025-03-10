const { update } = require("../model/update")
const { throwBadRequestError } = require("../../../../core/api-utils")

const sendSmtp = async ({ req }, context, rows, { connection, smtp }) => {

    const type = "html"
    const model = context.config["interaction/model"]
    
    /**
     * Send the batch of messages
     */

    for (let row of rows) {

        try {
            await smtp.sendMail({
                type: type,
                to: row.email,
                subject: row.email_subject,
                content: row.email_body
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
            throw throwBadRequestError()
        }
    }
}

module.exports = {
    sendSmtp
}