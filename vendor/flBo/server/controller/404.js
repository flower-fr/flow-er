const { render404 } = require("../view/render404")

const notFoundAction = async ({}, context) => {

    const data = {
        headerParams: context.config.headerParams,
        instance: context.instance,
        footer: context.config.footer,
    }

    return render404({ context }, data)
}

module.exports = {
    notFoundAction
}