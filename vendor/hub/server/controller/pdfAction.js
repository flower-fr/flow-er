const { assert } = require("../../../../core/api-utils")

const { decrypt } = require("../../../flCore/server/model/encrypt")
const { createPdf } = require("./createPdf")
const { select } = require("../../../flCore/server/model/select")

const getPdfAction = async ({ req, res, logger }, context, connection) => {
    const entity = assert.notEmpty(req.params, "entity")
    const id = assert.notEmpty(req.params, "id")

    let hash = req.query.hash
    if (!hash) return ["401"] // Unauthorized
    const name = decrypt(context, hash)

    const documentModel = context.config[`${ entity }/model`]

    const row = (await connection.execute(select(context, entity, ["name", "content"], { id }, null, null, documentModel)))[0][0]
    if (row.name !== name) return ["401"] // Unauthorized if query hash does not match the document name

    res.set("Content-type", "application/pdf")
    res.set("Content-disposition", `attachment; filename="${ row.name }"`)
    return Buffer.from(row.content, "base64")
}

const postPdfAction = async ({ req }, context, db) => {
    const entity = assert.notEmpty(req.params, "entity")
    const type = req.params.type || "devis"
    const owner_entity = req.params.owner_entity || "crm_commitment"
    const owner_id = req.params.owner_id
    const payload = req.body
    await createPdf({ entity, type, owner_entity, owner_id, payload }, context, db)
}

module.exports = {
    getPdfAction, postPdfAction
}