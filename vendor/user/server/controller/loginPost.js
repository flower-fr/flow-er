
const { checkPassword, getTokenPayload, checkToken, createToken, encryptPassword } = require("../../../../core/tools/security")
const { assert, throwUnauthorized } = require("../../../../core/api-utils")
const { select } = require("../../../flCore/server/model/select")
const { update } = require("../../../flCore/server/model/update")
const { renderLogin } = require("../view/renderLogin")

const loginPost = async ({ req, res }, context, config, db) => {

    const [ email, password ] = assert.notEmpty(req.body, "email", "password")
    const model = context.config["user/model"]

    const data = {
        headerParams: context.config.headerParams,
        instance: context.instance,
        footer: context.config.footer,
    }

    const [result] = (await db.execute(select(context, "user", ["id", "email", "locale", "password", "last_login", "last_updated", "login_failed"], { "email": email }, null, null, model)))
    const user = result[0]
    if (!user) {
        data.status = "403"
        return renderLogin({ context }, data)
    }
    context.user.id = user.id

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

    await db.execute(update(context, "user", [user.id], userData, model))

    if (!authorized) {
        data.status = "403"
        return renderLogin({ context }, data)
    }

    // New token

    const payloadModel = config.tokenPayloadModel
    const filters = { "user_id": user.id }
    const profileModel = context.config[payloadModel.model]
    const [rows] = await db.execute(select(context, payloadModel.entity, Object.keys(payloadModel.columns), filters, null, null, profileModel))
    user.user_id = user.id // Deprecated
    for (const [key, value] of Object.entries(rows[0])) user[payloadModel.columns[key]] = value

    const expiresIn = config.tokenExpirationTime
    const token = createToken(user, config.apiKey, expiresIn)

    res.cookie("session", `Bearer ${token}`, {
        path: "/", 
        domain: config.cookieDomain, 
        secure: (config.cookieSecure !== undefined) ? config.cookieSecure : true, 
        httpOnly: (config.cookieHttpOnly !== undefined) ? config.cookieHttpOnly : true
    })

    res.redirect("/")
}

module.exports = {
    loginPost
}