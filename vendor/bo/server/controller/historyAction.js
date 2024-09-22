const { assert } = require("../../../../core/api-utils")
const { select } = require("../../../flCore/server/model/select")
const { renderHistory } = require("../view/renderHistory")

const historyAction = async ({ req }, context, db) => {
    const entity = assert.notEmpty(req.params, "entity")
    const id = assert.notEmpty(req.params, "id")
    const view = (req.query.view) ? req.query.view : "default"

    const model = context.config[`${entity}/model`]
    const rows = (await db.execute(select(context, entity, ["text", "creation_time", "user_n_fn"], { "candidat_id": id }, { "creation_time": "DESC" }, null, model)))[0]
    return renderHistory(context, entity, view, id, rows)
}

module.exports = {
    historyAction
}