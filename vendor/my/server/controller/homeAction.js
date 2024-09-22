const { assert } = require("../../../../core/api-utils")

const { renderHome } = require("../view/renderHome")

const homeAction = async ({ req }, context, db) => {
    return renderHome()
}

module.exports = {
    homeAction
}