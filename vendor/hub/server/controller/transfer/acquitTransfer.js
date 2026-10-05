const { assert } = require("../../../../../core/api-utils")

const util = require("util")

const { consumeTransfer } = require("./consumeTransfer")

const acquitTransfer = async ({ req, res }, context, sql, smtp, logger) => 
{
    const transfer_id = assert.notEmpty(req.params, "transfer_id")
    const sender_identifier = assert.notEmpty(req.params, "sender_id")
    const recipient_identifier = assert.notEmpty(req.params, "recipient_id")
    const transferModel = context.config["datahub_transfer/model"]

    if (!transferModel) return [400, "Model for entity datahub_transfer not found in config"] // return error 400 if the entity given is incorrect

    // Retrieve place ids for the recipient and sender from their identifiers
    const place_ids = (await sql.execute({ context, type: "select", entity: "place", columns: ["id"], where: { identifier: [recipient_identifier, sender_identifier] } }))
    if (place_ids.length != 2) return [401, "Unauthorized : Recipient or sender not found"] // return error 401 if the recipient or sender is not found in the place table

    const transfer = await sql.execute({ context, type: "select", entity: "datahub_transfer", columns: ["id"], where: { id: transfer_id, sender_identifier, recipient_identifier } })
    if (!transfer || transfer.length === 0) return [400, "Transfer not found"]

    switch (req.body.action) {
    case "accept":
        await sql.execute({ context, type: "update", entity: "datahub_transfer", data: { status: "accepted" }, ids: [transfer_id] })
        break
    case "reject":
        await sql.execute({ context, type: "update", entity: "datahub_transfer", data: { status: "rejected" }, ids: [transfer_id] })
        break
    case "consume": {
        const passphrase = req.body.passphrase
        const privateKey = req.body.privateKey
        const result = await consumeTransfer({ entity: "datahub_transfer", transfer_id, sender_identifier, recipient_identifier, passphrase, privateKey }, context, sql, smtp, logger)

        if (Array.isArray(result)) return result
        if (result.content_type === "application/pdf") return [200, result.content, "application/pdf"]

        return result
    }
    default:
        return [400, `Action "${req.body.action}" not supported`] // return error 400 if the action is neither "accept", "reject" or "consume"
    }
}

module.exports = {
    acquitTransfer
}