const { assert } = require("../../../../core/api-utils")

const detailAction = ({ req }, context, db) => {
    const entity = assert.notEmpty(req.params, "entity")
    const id = assert.notEmpty(req.params, "id")
    const view = (req.query.view) ? req.query.view : "default"
    let detailConfig = context.config[`${entity}/detail/${view}`]
    if (!detailConfig) detailConfig = context.config[`${entity}/detail/default`]
    return JSON.stringify({ id: id, detailConfig: detailConfig })
}

module.exports = {
    detailAction
}