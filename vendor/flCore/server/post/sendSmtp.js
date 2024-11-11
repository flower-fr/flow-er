const { update } = require("../../../flCore/server/model/update")

const sendSmtp = async ({ req }, context, rows, { db, smtp }) => {

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

            await db.execute(update(context, "interaction", [row.insertId], { "status": "ok" }, model))
        }
        catch (err) {
                
            /**
             * Mark the interaction as KO
             */

            await db.execute(update(context, "interaction", [row.insertId], { "status": "ko" }, model))
        }
    }
}

module.exports = {
    sendSmtp
}