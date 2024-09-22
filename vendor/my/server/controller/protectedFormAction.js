const { assert } = require("../../../../core/api-utils")
const { select } = require("../../../flCore/server/model/select")

const { renderProtectedForm } = require("../view/renderProtectedForm")

const protectedFormAction = async ({ req }, context, db) => {
    const entity = assert.notEmpty(req.params, "entity")
    const id = assert.notEmpty(req.params, "id")
    const view = (req.query.view) ? req.query.view : "default"
    const key = req.query.key

    let formConfig = context.config[`${entity}/form/${view}`]
    const propertyDefs = formConfig.properties

    // Retrieve the existing row

    const model = context.config[`${entity}/model`]
    const columns = Object.keys(propertyDefs).concat(["id"])
    const row = (await db.execute(select(context, entity, columns, { "id": id }, null, null, model)))[0][0]
    if (key != "slkjd11mk") return
    return renderProtectedForm( { context, entity, view }, { user: { locale: "fr-FR" }, formConfig, row } )
}

module.exports = {
    protectedFormAction
}