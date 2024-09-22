const { assert } = require("../../../../core/api-utils")

const shortcutsAction = async ({ req }, context, db) => {

    const entity = assert.notEmpty(req.params, "entity")
    const view = (req.query.view) ? req.query.view : "default"

    return {}
}

module.exports = {
    shortcutsAction
}