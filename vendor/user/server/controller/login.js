const { createToken } = require("../../../../core/tools/security")
const { renderLogin } = require("../view/renderLogin")

const login = async ({ req }, context, config) =>
{
    const csrfToken = createToken({ form: "user/login" }, config.apiKey, 600)

    const data = {
        headerParams: context.config.headerParams,
        instance: context.instance,
        footer: context.config.footer,
        csrfToken
    }

    return renderLogin({ context }, data)
}

module.exports = {
    login
}