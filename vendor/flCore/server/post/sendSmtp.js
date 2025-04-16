const { select } = require("../../../flCore/server/model/select")
const { update } = require("../model/update")
const { throwBadRequestError } = require("../../../../core/api-utils")

const sendSmtp = async ({ req }, context, rows, { connection, smtp }) => {

    const type = "html"
    const model = context.config["interaction/model"]
    
    /**
     * Retrieve the attachments
     */

    const attachments = {}
    for (const row of rows) {
        for (const attachmentId of (row.attachments !== "") ? row.attachments.split(",") : []) {
            attachments[attachmentId] = null
        }
    }
    const where = ["in"].concat(Object.keys(attachments))
    const documentModel = context.config["document_binary/model"]
    const cursor = (await connection.execute(select(context, "document_binary", null, { "id": where }, null, null, documentModel)))[0]
    for (const attachment of cursor) {
        attachments[attachment.id] = attachment
    }

    /**
     * Send the batch of messages
     */

    for (let row of rows) {
        const attachmentsToSend = []
        for (const attachmentId of (row.attachments) ? row.attachments.split(",") : []) {
            const attachment = attachments[attachmentId]
            attachmentsToSend.push({ filename: attachment.name, content: attachment.data })
        }
        const data = {
            type: type,
            to: row.email,
            subject: row.email_subject,
            content: row.email_body
        }
        if (attachmentsToSend.length > 0) data.attachments = attachmentsToSend

        try {
            await smtp.sendMail(data)
    
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

const resendSmtp = async ({ req }, context, { db: connection, smtp }) => {

    const ids = ["in"].concat(req.body.ids.join(","))
    const type = "html"
    const model = context.config["interaction/model"]

    /**
     * Retrieve the interactions as mail to resend
     */

    const rows = (await connection.execute(select(context, "interaction", ["id", "params", "body", "attachments"], { "status": "new", "id": ids }, null, null, model)))[0]

    /**
     * Retrieve the attachments
     */

    const attachments = {}
    for (const row of rows) {
        for (const attachmentId of (row.attachments !== "") ? row.attachments.split(",") : []) {
            attachments[attachmentId] = null
        }
    }
    const where = ["in"].concat(Object.keys(attachments))
    const documentModel = context.config["document_binary/model"]
    const cursor = (await connection.execute(select(context, "document_binary", null, { "id": where }, null, null, documentModel)))[0]
    for (const attachment of cursor) {
        attachments[attachment.id] = attachment
    }

    /**
     * Send the batch of messages
     */

    for (let row of rows) {
        const params = JSON.parse(row.params)
        const attachmentsToSend = []
        for (const attachmentId of (row.attachments) ? row.attachments.split(",") : []) {
            const attachment = attachments[attachmentId]
            attachmentsToSend.push({ filename: attachment.name, content: Buffer.from(attachment.data) })
        }
        const data = {
            type: type,
            to: params.to,
            subject: params.subject,
            content: row.body
        }
        if (attachmentsToSend.length > 0) data.attachments = attachmentsToSend

        try {
            await smtp.sendMail(data)
    
            /**
             * Mark for each message the interaction as OK
             */

            await connection.execute(update(context, "interaction", [row.id], { "status": "ok" }, model))
        }
        catch (err) {
                
            /**
             * Mark the interaction as KO
             */

            await connection.execute(update(context, "interaction", [row.id], { "status": "ko" }, model))
            throw throwBadRequestError()
        }
    }
}

module.exports = {
    sendSmtp, resendSmtp
}