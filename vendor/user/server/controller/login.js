const { renderLogin } = require("../view/renderLogin")

const login = async ({ req }, context) => {

    const data = {
        headerParams: context.config.headerParams,
        instance: context.instance,
        footer: context.config.footer,
    }

    return renderLogin({ context }, data)
}

module.exports = {
    login
}