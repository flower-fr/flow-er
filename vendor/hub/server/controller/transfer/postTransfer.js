const { assert } = require("../../../../../core/api-utils")

const { publishTransfer } = require("./publishTransfer")

const postTransfer = async ({ req }, context, sql, smtp, logger) => {
    const sender_identifier = assert.notEmpty(req.params, "sender_id")
    const recipient_identifier = assert.notEmpty(req.params, "recipient_id")
    const transferModel = context.config["datahub_transfer/model"]

    if (!transferModel) return [400, "Model for entity datahub_transfer not found in config"] // return error 400 if the entity given is incorrect

    const sender = { identifier: sender_identifier }
    sender.id = (await sql.execute({ context, type: "select", entity: "place", columns: ["id"], where: { identifier: sender_identifier } }))[0]?.id
    if (!sender.id) return [401, `Unauthorized : Sender ${sender_identifier} not found`]

    const recipient = { identifier: recipient_identifier }
    recipient.id = (await sql.execute({ context, type: "select", entity: "place", columns: ["id"], where: { identifier: recipient_identifier } }))[0]?.id
    if (!recipient.id) return [401, `Unauthorized : Recipient ${recipient_identifier} not found`]

    const content = req.body
    publishTransfer({ sender, recipient, content_type: req.get("Content-Type"), content, entity: "datahub_transfer" }, context, sql, smtp, logger)
}

module.exports = {
    postTransfer
}