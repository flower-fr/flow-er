const { createDbClient } = require("../../../utils/db-client")
const { checkPassword, getTokenPayload, checkToken, createToken, encryptPassword } = require("../../../../core/tools/security")
const { assert, throwUnauthorized } = require("../../../../core/api-utils")
const { select } = require("../../../flCore/server/model/select")
const { update } = require("../../../flCore/server/model/update")
const { renderCreateAccount } = require("../view/create-account")
const { renderResetPassword } = require("../view/reset-password")

const checkCredentials = async ({ req }, context, config) => {

    const db = await createDbClient(config.db, context.dbName)

    const now = new Date()
    const [ email, password ] = assert.notEmpty(req.body, "email", "password")

    const model = context.config["user/model"]
    const [result, fields] = (await db.execute(select(context, "user", ["id", "email", "password", "last_login", "last_updated", "login_failed"], { "email": email }, null, null, model)))
    const user = result[0]
    if (!user) return throwUnauthorized()
    const data = {}
    const authorized = await checkPassword(password, user.password)
    if (!authorized) {
        data.last_updated = new Date().toISOString().slice(0, 19).replace("T", " ")
        data.login_failed = user.login_failed + 1
    }
    else {
        data.last_login = new Date().toISOString().slice(0, 19).replace("T", " ")
        data.login_failed = 0
    }

    await db.execute(update(context, "user", [user.id], data, model))

    if (!authorized) {
        return throwUnauthorized()
    }

    if (user.status === "pending") {
        return throwUnauthorized("account not activated", "NOT_ACTIVATED")
    }

    return { 
        status: "ok",
        user: {
            ...user,
            credentials: undefined
        }
    }
}

const checkActivationToken = async ({ req }, context, db) => {
    let token = assert.notEmpty(req.body, "token")
    token = Buffer.from(token, "base64").toString()

    const { email } = getTokenPayload(token)
    const model = context.config["user/model"]
    const [result, fields] = (await db.execute(select(context, "user", ["id", "email", "password", "last_login", "last_updated", "login_failed"], { "email": email }, null, null, model)))
    const user = result[0]
    if (!user) return throwUnauthorized()

    const timestamp = user.lastUpdated.getTime()
    const hashKey = `${user.password}-${timestamp}`
    const { status } = await checkToken(token, hashKey)
    
    if (status !== "ok") {
        return throwUnauthorized("invalid token", status === "expired" ? "TOKEN_EXPIRED" : "INVALID_TOKEN")
    }
    else {
        const data = {
            last_updated: new Date(),
            status: "active"
        }
        await db(update(context, "user", [id], data))
    }

    return { status: "ok" }
}

const saveRefreshToken = async ({ req }, context, db) => {
    const [ user_id, refreshToken ] = assert.notEmpty(req.body, "user_id", "refreshToken")
    const payload = getTokenPayload(refreshToken)
    const model = context.config["user/model"]
    const [result, fields] = (await db.execute(select(context, "user", ["id", "email", "password", "last_login", "last_updated", "login_failed"], { "id": id }, null, null, model)))
    const user = result[0]
    if (user_id !== payload.user_id || !user) {
        return throwUnauthorized("illegal refresh token save attempt")
    }
    await db(update(context, "user", [user_id], { refresh_token: refreshToken }))
    return { status: "ok" }
}

const checkRefreshToken = async ({ req }, context, db) => {
    const [ user_id, refreshToken ] = assert.notEmpty(req.body, "user_id", "refreshToken")
    const payload = getTokenPayload(refreshToken)
    const [result, fields] = (await db.execute(select(context, "user", ["id", "email", "password", "last_login", "last_updated", "login_failed"], { "id": id }, null, null, model)))
    const user = result[0]
    if (user_id !== payload.user_id || !user || user.refresh_token !== refreshToken) {
        return throwUnauthorized("invalid refresh token")
    }

    return { status: "ok" }
}

const requestPasswordReset = async ({ req, config }, context, db, mailClient) => {
    let [origin, email] = assert.notEmpty(req.body, "origin", "email")
    email = email.toLowerCase()
    const model = context.config["user/model"]
    const [result, fields] = (await db.execute(select(context, "user", ["id", "email", "password", "last_login", "last_updated", "login_failed"], { "email": email }, null, null, model)))
    const user = result[0]

    if (user && user.status === "active") {
        const hashKey = `${user.password}-${user.last_updated.getTime()}`
        const token = createToken({ email }, hashKey, config.resetPasswordTokenExpirationTime)
        const data = {
            resetPasswordLink: `${origin}user/reinitialisation-mot-de-passe"/${Buffer(token).toString("base64")}`,
            registrationLink: context.instance.fqdn
        }
        const content = renderResetPassword(context, data)
        await mailClient.sendMail({
            type: "html",
            from: context.config["reset-password"].replyAddress,
            to: email,
            subject: context.localize("Réinitialisation mot de passe Flow-ER"),
            content: content
        })
    }
    else {
        return throwUnauthorized("account not activated", "NOT_ACTIVATED")
    }

    return {status: "ok"}
}

const resetPassword = async ({ req }, context, db) => {
    const now = new Date()
    let [token, email, password] = assert.notEmpty(req.body, "token", "email", "password")
    token = Buffer.from(token, "base64").toString()
    const model = context.config["user/model"]
    const [result, fields] = (await db.execute(select(context, "user", ["id", "email", "password", "last_login", "last_updated", "login_failed"], { "email": email }, null, null, model)))
    const user = result[0]
    const hashKey = `${user.password}-${user.last_updated.getTime()}`
    const { status, payload } = await checkToken(token, hashKey)

    if (status === "expired") {
        return throwUnauthorized("token expired")
    }
    else if (status === "invalid") {
        return throwUnauthorized("invalid token")
    }
    else if (email !== payload.email) {
        return throwUnauthorized("invalid email")
    }

    const data = {
        password: await encryptPassword(password),
        last_updated: now,
        login_failed: 0,
    }
    await db(update(context, "user", [user.user_id], data))
    
    return {status: "ok"}
}

const sendActivationLink = async ({ req, config }, context, db, mailClient) => {
    let [origin, email] = assert.notEmpty(req.body, "origin", "email")
    email = email.toLowerCase()
    const model = context.config["user/model"]
    const [result, fields] = await db.execute(context, select("user", ["id", "status", "email", "password", "last_login", "last_updated", "login_failed"], { "email": email }, null, null, model))
    const user = result[0]
    if (user && user.status === "pending") {
        const hashKey = `${user.password}-${user.last_updated.getTime()}`
        const token = createToken({ email }, hashKey, config.accountActivationTokenExpirationTime)
        const data = {
            activationLink: `${origin}user/activation/${Buffer(token).toString("base64")}`,
            registrationLink: context.instance.fqdn
        }
        const content = renderCreateAccount(context, data)
        /*await mailClient.sendMail({
            type: "html",
            from: context.config["create-account"].replyAddress,
            to: email,
            subject: context.translate("Bienvenue chez Flow-ER"),
            content: content
        })*/
    }
    else {
        return throwUnauthorized("account already activated", "ALREADY_ACTIVATED")
    }

    return {status: "ok"}
}

module.exports = {
    checkCredentials,
    checkActivationToken,
    saveRefreshToken,
    checkRefreshToken,
    requestPasswordReset,
    resetPassword,
    sendActivationLink
}