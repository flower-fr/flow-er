const { assert } = require("../../../../core/api-utils")

const detailAction = ({ req }, context, db) => {
    const entity = assert.notEmpty(req.params, "entity")
    const id = assert.notEmpty(req.params, "id")
    const view = (req.query.view) ? req.query.view : "default"
    const detailConfig = context.config[`${entity}/detail/${view}`]
    return JSON.stringify({ id: id, detailConfig: detailConfig })
}

module.exports = {
    detailAction
}