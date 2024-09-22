const { assert } = require("../../../../core/api-utils")

const { renderProfile } = require("../view/renderProfile")

const profileAction = async ({ req }, context, db) => {
    return renderProfile()
}

module.exports = {
    profileAction
}