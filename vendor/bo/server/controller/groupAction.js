const { assert } = require("../../../../core/api-utils")

const groupAction = ({ req }, context) => {
    const entity = assert.notEmpty(req.params, "entity")
    const view = (req.query.view) ? req.query.view : "default"
    let groupConfig = context.config[`${entity}/group/${view}`]
    if (!groupConfig) groupConfig = context.config[`${entity}/group/default`]
    return JSON.stringify({ detailConfig: groupConfig })
}

module.exports = {
    groupAction
}