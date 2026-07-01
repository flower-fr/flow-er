const { createToken } = require("../../../../core/tools/security")
const { renderLogin } = require("../view/renderLogin")
const { renderLoginV2 } = require("../view/renderLoginV2")

const loginV2 = async ({ req }, context, config) =>
{
    const csrfToken = createToken({ form: "user/login" }, config.jwtCsrfSecret, config.jwtCsrfExpirationTime)

    const data = {
        headerParams: context.config.headerParams,
        instance: context.instance,
        footer: context.config.footer,
        csrfToken
    }

    return renderLogin({ context }, data)
}

const login = async ({ req }, context, config) =>
{
    const csrfToken = createToken({ form: "user/login" }, config.jwtCsrfSecret, config.jwtCsrfExpirationTime)

    const data = {
        headerParams: context.config.headerParams,
        instance: context.instance,
        footer: context.config.footer,
        csrfToken
    }

    return renderLogin({ context }, data)
}

module.exports = {
    login,
    loginV2
}