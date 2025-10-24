const moment = require("moment")

const { select } = require("../../../flCore/server/model/select")
const { update } = require("../model/update")
const { throwBadRequestError } = require("../../../../core/api-utils")

const sendSmtp = async ({ req }, context, rows, { sql, smtp }) => {

    const type = "html"
    const model = context.config["interaction/model"]
    
    /**
     * Retrieve the attachments
     */

    const attachments = {}
    for (const row of rows) {
        for (const attachmentId of (row.attachments) ? row.attachments.split(",") : []) {
            attachments[attachmentId] = null
        }
    }
    if (Object.values(attachments).length > 0) {
        const where = ["in"].concat(Object.keys(attachments))
        const documentModel = context.config["document_binary/model"]
        // const cursor = (await connection.execute(select(context, "document_binary", null, { "id": where }, null, null, documentModel)))[0]
        const cursor = await sql.execute({ context, type: "select", entity: "document_binary", where: {id: where} })
        for (const attachment of cursor) {
            attachments[attachment.id] = attachment
        }    
    }

    /**
     * Send the batch of messages
     */

    for (let row of rows) {
        if (!row.scheduled_at || row.scheduled_at === "") {
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
            if (row.cc) data.cc = row.cc
            if (row.cci) data.bcc = row.cci
            if (attachmentsToSend.length > 0) data.attachments = attachmentsToSend

            try {
                await smtp.sendMail(data)
        
                /**
                 * Mark for each message the interaction as OK
                 */

                // await connection.execute(update(context, "interaction", [row.insertId], { "status": "ok" }, model))
                await sql.execute({ context, type: "update", entity: "interaction", ids: [row.insertId], data: { "status": "ok" }})
            }
            catch (err) {
                    
                /**
                 * Mark the interaction as KO
                 */

                // await connection.execute(update(context, "interaction", [row.insertId], { "status": "ko" }, model))
                await sql.execute({ context, type: "update", entity: "interaction", ids: [row.insertId], data: { "status": "ko" }})
                throw throwBadRequestError()
            }
        }
    }
}

const resendSmtp = async ({ context, sql, smtp, ids }) => 
{
    const type = "html"
    const model = context.config["interaction/model"]

    /**
     * Retrieve the interactions as mail to resend
     */

    const where = { "status": "new", "provider": "smtp" }
    if (ids) where.id = ids
    // const rows = (await connection.execute(select(context, "interaction", ["id", "scheduled_at", "params", "body", "attachments"], where, null, null, model)))[0]
    const rows = await sql.execute({ context, type: "select", entity: "interaction", columns: ["id", "scheduled_at", "params", "body", "attachments"], where })

    /**
     * Retrieve the attachments
     */

    const attachments = {}
    for (const row of rows) {
        for (const attachmentId of (row.attachments !== "") ? row.attachments.split(",") : []) {
            attachments[attachmentId] = null
        }
    }
    if (Object.values(attachments).length > 0) {
        const where = ["in"].concat(Object.keys(attachments))
        // const documentModel = context.config["document_binary/model"]
        // const cursor = (await connection.execute(select(context, "document_binary", null, { "id": where }, null, null, documentModel)))[0]
        const cursor = await sql.execute({ context, type: "select", entity: "document_binary", where: { "id": where } })
        for (const attachment of cursor) {
            attachments[attachment.id] = attachment
        }
    }

    /**
     * Send the batch of messages
     */

    for (let row of rows) {
        if (!row.scheduled_at || moment(row.scheduled_at).format("YYYY-MM-DD HH:mm:ss") < moment().format("YYYY-MM-DD HH:mm:ss")) {
            const params = JSON.parse(row.params)
            const attachmentsToSend = []
            for (const attachmentId of (row.attachments) ? row.attachments.split(",") : []) {
                const attachment = attachments[attachmentId]
                attachmentsToSend.push({ filename: attachment.name, content: attachment.data })
            }
            const data = {
                type: type,
                to: params.to,
                subject: params.subject,
                content: row.body
            }
            if (params.cc) data.cc = params.cc
            if (params.cci) data.bcc = params.cci
            if (attachmentsToSend.length > 0) data.attachments = attachmentsToSend

            try {
                await smtp.sendMail(data)
        
                /**
                 * Mark for each message the interaction as OK
                 */

                // await connection.execute(update(context, "interaction", [row.id], { "status": "ok" }, model))
                await sql.execute({ context, type: "update", entity: "interaction", ids: [row.id], data: { "status": "ok" }})
            }
            catch (err) {
                    
                /**
                 * Mark the interaction as KO
                 */

                // await connection.execute(update(context, "interaction", [row.id], { "status": "ko" }, model))
                await sql.execute({ context, type: "update", entity: "interaction", ids: [row.id], data: { "status": "ko" }})
                throw throwBadRequestError()
            }
        }
    }
}

module.exports = {
    sendSmtp, resendSmtp
}