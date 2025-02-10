const { renderChangePassword } = require("../view/renderChangePassword")

const changePassword = async ({ req }, context) => {

    const data = {
        headerParams: context.config.headerParams,
        instance: context.instance,
        footer: context.config.footer,
    }

    return renderChangePassword({ context }, data)
}

module.exports = {
    changePassword
}