const { renderLogout } = require("../view/renderLogout")

const logout = async ({ res }, context) => {

    const data = {
        headerParams: context.config.headerParams,
        instance: context.instance,
        footer: context.config.footer,
    }

    res.clearCookie("session");

    return renderLogout({ context }, data)
}

module.exports = {
    logout
}