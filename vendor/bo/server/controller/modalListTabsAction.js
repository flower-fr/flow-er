const { assert } = require("../../../../core/api-utils")

const modalListTabsAction = ({ req }, context, db) => {
    const entity = assert.notEmpty(req.params, "entity")
    const id = assert.notEmpty(req.params, "id")
    const view = (req.query.view) ? req.query.view : "default"
    const modalListTabsConfig = context.config[`${entity}/modalListTabs/${view}`]
    return JSON.stringify({ id: id, modalListTabsConfig: modalListTabsConfig })
}

module.exports = {
    modalListTabsAction
}