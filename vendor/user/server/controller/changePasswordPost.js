
const { createToken, checkToken, checkPassword, encryptPassword } = require("../../../../core/tools/security")
const { renderChangePassword } = require("../view/renderChangePassword")
const { assert, throwUnauthorized } = require("../../../../core/api-utils")
const { select } = require("../../../flCore/server/model/select")
const { update } = require("../../../flCore/server/model/update")

const changePasswordPost = async ({ req, res }, context, config, db) => {

    const [ email, currentPassword, newPassword, csrfToken ] = assert.notEmpty(req.body, "email", "currentPassword", "newPassword", "csrfToken")

    // Check CSRF token
    const { status } = await checkToken(csrfToken, config.apiKey)
    if (status === "invalid") {
        return res.redirect("/user/login")
    }
    else if (status === "expired") {
        return renderChangePassword({ context }, { 
            status: "401", 
            headerParams: context.config.headerParams, 
            instance: context.instance, 
            footer: context.config.footer, 
            csrfToken: createToken({ form: "user/change-password" }, config.apiKey, 600) 
        })
    }

    const model = context.config["user/model"]

    const [result] = (await db.execute(select(context, "user", ["id", "email", "password", "last_login", "last_updated", "login_failed"], { "email": email }, null, null, model)))
    const user = result[0]
    if (!user) return throwUnauthorized("Unauthorized")

    const userData = {}
    const authorized = await checkPassword(currentPassword, user.password)
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
        return renderChangePassword({ context }, { 
            status: "403", 
            headerParams: context.config.headerParams, 
            instance: context.instance, 
            footer: context.config.footer, 
            csrfToken: createToken({ form: "user/change-password" }, config.apiKey, 600) 
        })
        // return throwUnauthorized("Unauthorized")
    }

    const encryptedPassword = await encryptPassword(newPassword)
    await db.execute(update(context, "user", [user.id], { status: "active", password: encryptedPassword }, model))

    res.clearCookie("session")

    return renderChangePassword({ context }, { 
        status: "200", 
        headerParams: context.config.headerParams, 
        instance: context.instance, 
        footer: context.config.footer, 
    })
}

module.exports = {
    changePasswordPost
}