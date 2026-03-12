const { createToken } = require("../../../../core/tools/security")
const { renderChangePassword } = require("../view/renderChangePassword")

const changePassword = async ({ req }, context, config) => {

    const data = {
        headerParams: context.config.headerParams,
        instance: context.instance,
        footer: context.config.footer,
        csrfToken: createToken({ form: "user/change-password" }, config.apiKey, 600),
    }

    return renderChangePassword({ context }, data)
}

module.exports = {
    changePassword
}