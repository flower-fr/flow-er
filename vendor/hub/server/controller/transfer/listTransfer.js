const { assert } = require("../../../../../core/api-utils")

const listTransfer = async ({ req, res }, context, sql, logger) => {
    const recipient_identifier = assert.notEmpty(req.params, "recipient_id")
    const sender_identifier = assert.notEmpty(req.params, "sender_id")

    const transferModel = context.config["datahub_transfer/model"]
    if (!transferModel) return [400, "Model for entity datahub_transfer not found in config"]

    // Retrieve place ids for the recipient and sender from their identifiers
    const place_ids = (await sql.execute({ context, type: "select", entity: "place", columns: ["id"], where: { identifier: [recipient_identifier, sender_identifier] } }))
    if (place_ids.length != 2) return [401, "Unauthorized : Recipient or sender not found"] // return error 401 if the recipient or sender is not found in the place table

    const result = await sql.execute({ context, type: "select", entity: "datahub_transfer", columns: ["id", "status", "content_type"], where: { status: "published", sender_identifier, recipient_identifier } })

    res.set("Content-type", "application/json")

    return { "data": result }

}

module.exports = {
    listTransfer
}