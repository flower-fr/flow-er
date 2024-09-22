const { assert } = require("../../../../core/api-utils")

const { renderPublicForm } = require("../view/renderPublicForm")

const publicFormAction = async ({ req }, context, db) => {
    const entity = assert.notEmpty(req.params, "entity")
    const view = (req.query.view) ? req.query.view : "default"

    let formConfig = context.config[`${entity}/form/${view}`]

    return renderPublicForm( { context, entity, view }, { user: { locale: "fr-FR" }, formConfig } )
}

module.exports = {
    publicFormAction
}