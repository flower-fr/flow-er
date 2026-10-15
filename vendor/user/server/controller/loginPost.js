const moment = require("moment")
const util = require("util")

const { checkPassword, checkToken, createToken } = require("../../../../core/tools/security")
const { createAccessToken } = require("./utils/createAccessToken")
const { assert } = require("../../../../core/api-utils")
const { renderLogin } = require("../view/renderLogin")

const loginPostV2 = async ({ req, res }, context, config, sql, logger) =>
{
    let [ csrfToken, email, password ] = assert.notEmpty(req.body, "csrfToken", "email", "password")

    const data = {
        headerParams: context.config.headerParams,
        instance: context.instance,
        footer: context.config.footer,
        csrfToken: createToken({ form: "user/login" }, config.jwtCsrfSecret, config.jwtCsrfExpirationTime)
    }

    // Check CSRF token
    let { status } = await checkToken(csrfToken, config.jwtCsrfSecret)
    if (status === "invalid") {
        logger && logger.debug(util.inspect({ csrfToken, status }))
        // return [401, { status: "expired", csrfToken }, "application/json"]
        return res.redirect("/user/login")
    } else if (status === "expired") {
        logger && logger.debug(util.inspect({ csrfToken, status }))
        // return [401, { status: "expired", csrfToken }, "application/json"]
        return renderLogin({ context }, data)
    }

    // csrfToken = createToken({ form: "user/login" }, config.jwtCsrfSecret, config.jwtCsrfExpirationTime)

    const result = await sql.execute({ context, type: "select", entity: "user", columns: ["id", "status", "email", "locale", "password", "last_login", "last_updated", "login_failed"], where: { "email": email } })
    const user = result[0]
    if (!user) {
        logger && logger.debug(util.inspect({ csrfToken, user }))
        return [403, { status: "unauthorized", csrfToken }, "application/json"]
    }

    context.user.id = user.id
    user.user_id = user.id // Deprecated

    const userData = {}
    const authorized = await checkPassword(password, user.password)
    if (!authorized) {
        userData.last_updated = new Date().toISOString().slice(0, 19).replace("T", " ")
        userData.login_failed = user.login_failed + 1
    }
    else {
        userData.last_login = new Date().toISOString().slice(0, 19).replace("T", " ")
        userData.login_failed = 0
    }

    if (!authorized) {
        await sql.execute({ context, type: "update", entity: "user", ids: [user.id], data: userData})
        logger && logger.debug(util.inspect({ csrfToken, password }))
        // return [403, { status: "unauthorized", csrfToken }, "application/json"]
        data.status = "403"
        return renderLogin({ context }, data)
    }

    // New tokens

    const accessToken = await createAccessToken(context, config, user, sql)
    const refreshToken = createToken({ id: user.id }, config.jwtRefreshSecret, config.jwtRefreshExpirationTime)
    userData.refresh_token_expires_at = moment().add(config.jwtRefreshExpirationTime).format("YYYY-MM-DD HH:mm:ss")

    await sql.execute({ context, type: "update", entity: "user", ids: [user.id], data: userData})

    res.cookie("refresh", refreshToken, {
        httpOnly: true,
        secure: true, 
        sameSite: "strict",
        path: "/", 
        maxAge: config.jwtRefreshExpirationTime,
    })

    res.cookie("access", accessToken, {
        httpOnly: true,
        secure: true, 
        sameSite: "strict",
        path: "/", 
        maxAge: config.jwtExpirationTime,
    })

    // return [200, { status: "ok" }, "application/json"]
    res.redirect("/")
}

const loginPost = async ({ req, res }, context, config, sql) =>
{
    const [ csrfToken, email, password ] = assert.notEmpty(req.body, "csrfToken", "email", "password")

    const data = {
        headerParams: context.config.headerParams,
        instance: context.instance,
        footer: context.config.footer,
        csrfToken: createToken({ form: "user/login" }, config.jwtCsrfSecret, config.jwtCsrfExpirationTime)
    }

    // Check CSRF token
    const { status } = await checkToken(csrfToken, config.jwtCsrfSecret)
    if (status === "invalid") {
        return res.redirect("/user/login")
    }
    else if (status === "expired") {
        data.status = "401"
        return renderLogin({ context }, data)
    }

    const result = await sql.execute({ context, type: "select", entity: "user", columns: ["id", "status", "email", "locale", "password", "last_login", "last_updated", "login_failed"], where: { "email": email } })
    const user = result[0]
    if (!user) {
        data.status = "403"
        return renderLogin({ context }, data)
    }
    context.user.id = user.id
    user.user_id = user.id // Deprecated

    const userData = {}
    const authorized = await checkPassword(password, user.password)
    if (!authorized) {
        userData.last_updated = new Date().toISOString().slice(0, 19).replace("T", " ")
        userData.login_failed = user.login_failed + 1
    }
    else {
        userData.last_login = new Date().toISOString().slice(0, 19).replace("T", " ")
        userData.login_failed = 0
    }

    if (!authorized) {
        await sql.execute({ context, type: "update", entity: "user", ids: [user.id], data: userData})
        data.status = "403"
        return renderLogin({ context }, data)
    }

    // New token

    const payloadModel = config.tokenPayloadModel
    const filters = { "user_id": user.id }
    const rows = await sql.execute({ context, type: "select", entity: payloadModel.entity, columns: Object.keys(payloadModel.columns), where: filters})
    const payload = { id: user.id, locale: user.locale, status: user.status }
    for (const [key, value] of Object.entries(rows[0])) payload[payloadModel.columns[key]] = value
    const expiresIn = config.tokenExpirationTime
    const token = createToken(payload, config.apiKey, expiresIn)

    await sql.execute({ context, type: "update", entity: "user", ids: [user.id], data: userData})

    res.cookie("session", `Bearer ${token}`, {
        httpOnly: (config.cookieHttpOnly !== undefined) ? config.cookieHttpOnly : true,
        secure: (config.cookieSecure !== undefined) ? config.cookieSecure : true, 
        sameSite: "strict",
        path: "/", 
    })

    res.redirect("/")
}

module.exports = {
    loginPost,
    loginPostV2,
}