const { renderLogin } = require("../view/renderLogin")

const login = async ({ req, next }, context, config) => {

    const data = {
        headerParams: context.config.headerParams,
        instance: context.instance,
        footer: context.config.footer,
    }

    const session = req.cookies["session"]
    if (!session) {
        return renderLogin({ context }, data)
    }

    const [schema, token] = session.split(" ")

    if (!token || schema !== "Bearer") {
        return renderLogin({ context }, data)
    }

    try {
        const { status } = await checkToken(token, config.apiKey)
        if (status === "invalid") {
            return renderLogin({ context }, data)
        }
        else if (status === "expired") {
            return renderLogin({ context }, data)
        }
        else if (status === "ok") {
            next()
        }
        else {
            return renderLogin({ context }, data)
        }
    }
    catch (error) {
        return renderLogin({ context }, data)
    }
}

module.exports = {
    login
}