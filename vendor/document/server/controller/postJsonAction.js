const { assert, throwConflictError } = require("../../../../core/api-utils")
const { select } = require("../../../flCore/server/model/select")
const { update } = require("../../../flCore/server/model/update")
const { insert } = require("../../../flCore/server/model/insert")
const { updateCase } = require("../../../flCore/server/model/updateCase")

const constructPartsVector = async (context, partModel, parts, db) => {
    const partsVector = []
    for (const part of parts) {
        if (part.id) partsVector.push(part.id)
        else {
            const [insertedRow] = (await db.execute(insert(context, "document_text", { "data": JSON.stringify(part) }, partModel)))
            partsVector.push(insertedRow.insertId)
        }
    }
    return partsVector
}

const postJsonAction = async ({ req }, context, db) => {
    const entity = assert.notEmpty(req.params, "entity")
    const name = assert.notEmpty(req.params, "name")

    const model = context.config[`${entity}/model`]
    const partModel = context.config[`document_text/model`]

    /**
     * Retrieve existing version
     */
    const existing = (await db.execute(select(context, entity, [["max", "version", ["name"]]], { "name": name }, null, null, model)))[0][0]
    await db.beginTransaction()

    const parts = req.body
    const partsVector = constructPartsVector(context, partModel, parts, db)

    const data = {
        "type": "text",
        "name": name,
        "mime": "application/json",
        "version": (existing) ? existing.version + 1 : 1,
        "content_vector": (await partsVector).join(",")
    }
    const [insertedRow] = (await db.execute(insert(context, entity, data, model)))
    data.id = insertedRow.insertId

    await db.commit()
    return JSON.stringify({ "status": "ok", "stored": data })
}

module.exports = {
    postJsonAction
}