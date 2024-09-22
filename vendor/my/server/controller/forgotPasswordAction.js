const { assert } = require("../../../../core/api-utils")

const { renderForgotPassword } = require("../view/renderForgotPassword")

const forgotPasswordAction = async ({ req }, context, db) => {
    return renderForgotPassword()
}

module.exports = {
    forgotPasswordAction
}