const { assert } = require("../../../core/api-utils")
const { throwBadRequestError } = require("../../../core/api-utils")
const util = require("util")
const { renderIndex } = require("./renderer/renderIndex")

const indexAction = async ({ req }, { context, logger }) => 
{
    const entity = assert.notEmpty(req.params, "entity")
    const view = req.query.view || "default"
    try {
        return renderIndex({ context, entity, view, locale: "fr_FR", theme: "dark", title: { fr_FR: "POC" } })
    }
    catch(err) {
        logger && logger.error(err)
        throw throwBadRequestError()
    }
}

module.exports = {
    indexAction
}