const { assert } = require("../../../../core/api-utils")

const { renderChangePassword } = require("../view/renderChangePassword")

const changePasswordAction = async ({ req }, context, db) => {
    return renderChangePassword()
}

module.exports = {
    changePasswordAction
}