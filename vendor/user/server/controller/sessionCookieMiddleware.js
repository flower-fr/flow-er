const { checkToken } = require("../../../../core/tools/security")
const { refreshToken } = require("./refreshToken")

const sessionCookieMiddleware = (config, context, sql, logger) => async (req, res, next) => {

    let session = req.cookies["session"] || req.query.jwt, token
    if (!session) {
        return handleAccessToken({ req, res, next }, context, config, sql, logger)
    } else { // Deprecated
        const [schema, t] = session.split(" ")
        if (!t || schema !== "Bearer") {
            return res.redirect("/user/login")
        }
        token = t
    }

    try {
        const { status, payload } = await checkToken(token, config.apiKey)
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

const handleAccessToken = async ({ req, res, next }, context, config, sql, logger) => {
    let token = req.cookies["access"]
    if (!token) {
        token = await renewAccessToken({ req, res }, context, config, sql, logger)
        if (!token) {
            return res.redirect("/user/login")
        }
    }

    try {
        let { status, payload } = await checkToken(token, config.apiKey)
        if (status === "invalid") {
            return res.redirect("/user/login")
        }
        else if (status === "expired") {
            token = await renewAccessToken({ req, res }, context, config, sql, logger)
            if (!token) {
                return res.redirect("/user/login")
            }
            ({ status, payload } = await checkToken(token, config.apiKey))
        }
        if (status === "ok") {
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

const renewAccessToken = async ({ req, res }, context, config, sql, logger) => {
    const newToken = await refreshToken({ req, res }, context, config, sql, logger)
    
    if (!newToken) return null

    res.cookie("access", newToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        path: "/",
        maxAge: config.jwtExpirationTimeMs,
    })
    return newToken
}

module.exports = {
    sessionCookieMiddleware
}