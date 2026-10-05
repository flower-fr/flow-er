const { assert } = require("../../../../../core/api-utils")
const util = require("util")

const getTransfer = async ({ req, res }, context, sql, logger) => {
    const recipient_identifier = assert.notEmpty(req.params, "recipient_id")
    const sender_identifier = assert.notEmpty(req.params, "sender_id")
    const transfer_id = assert.notEmpty(req.params, "transfer_id")

    const transferModel = context.config["datahub_transfer/model"]
    if (!transferModel) return [400, "Model for entity datahub_transfer not found in config"] // return error 400 if the entity given is incorrect

    // Retrieve place ids for the recipient and sender from their identifiers
    const place_ids = (await sql.execute({ context, type: "select", entity: "place", columns: ["id"], where: { identifier: [recipient_identifier, sender_identifier] } }))
    if (place_ids.length != 2) return [401, "Unauthorized : Recipient or sender not found"] // return error 401 if the recipient or sender is not found in the place table

    const result = (await sql.execute({ context, type: "select", entity: "datahub_transfer", columns: ["id", "status", "content_type", "data"], where: { id: transfer_id, sender_identifier, recipient_identifier } }))[0]
    if (!result) return [404, "Transfer not found"] // return error 404 if the transfer is not found

    res.set("Content-type", "application/json")
    return result
}

module.exports = {
    getTransfer
}