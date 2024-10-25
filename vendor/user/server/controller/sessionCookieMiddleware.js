const { createToken, checkToken, checkPassword, getTokenPayload } = require("../../../../core/tools/security")
const { executeService, assert } = require("../../../../core/api-utils")

const sessionCookieMiddleware = config => async (req, res, next) => {

    const session = req.cookies["session"]
    if (!session) {
        return res.redirect("/user/login")
    }

    const [schema, token] = session.split(" ")

    if (!token || schema !== "Bearer") {
        return res.redirect("/user/login")
    }

    try {
        const { status } = await checkToken(token, config.apiKey)
        if (status === "invalid") {
            return res.redirect("/user/login")
        }
        else if (status === "expired") {
            return res.redirect("/user/login")
        }
        else if (status === "ok") {
            next()
        }
        else {
            return res.redirect("/user/login")
        }
    }
    catch (error) {
        return res.redirect("/user/login")
    }
}

module.exports = {
    sessionCookieMiddleware
}