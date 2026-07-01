const { checkToken } = require("../../../../core/tools/security")

const sessionCookieMiddleware = (config, context) => async (req, res, next) => {

    let session = req.cookies["session"] || req.query.jwt, token
    if (!session) {
        token = req.cookies["access"]
        if (!token) {
            return res.redirect("/user/login")
        }
    } else { // Deprecated
        const [schema, t] = session.split(" ")
        if (!t || schema !== "Bearer") {
            return res.redirect("/user/login")
        }
        token = t
    }

    try {
        const { status, payload } = await checkToken(token, config.apiKey)
console.log({ token, status, payload })
        if (status === "invalid") {
            return res.redirect("/user/login")
        }
        else if (status === "expired") {
            return res.redirect("/user/login")
        }
        else if (status === "ok") {
            if (payload.status === "expired") {
                return res.redirect("/user/change-password")
            }
            if (context) context.user = payload
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