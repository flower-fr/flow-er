
const { checkToken, encryptPassword } = require("../../../../core/tools/security")
const { assert, throwUnauthorized } = require("../../../../core/api-utils")
const { select } = require("../../../flCore/server/model/select")
const { update } = require("../../../flCore/server/model/update")
const crypto = require("crypto")

const newPasswordPost = async ({ req, res }, context, config, db) => {
    const [ email, newPassword, csrfToken, token ] = assert.notEmpty(req.body, "email", "newPassword", "csrfToken", "token")

    try { 
        // Check token
        const { status: tokenStatus, payload } = await checkToken(token, config.apiKey)
        if (tokenStatus === "invalid") {
            return [400, { message: "Invalid token" }, "application/json"]
        }
        else if (tokenStatus === "expired") {
            return [410, { message: "Expired token" }, "application/json"]
        }
        else if (tokenStatus !== "ok") {
            return [500, { message: "Internal server error" }, "application/json"]
        }

        // Check CSRF token
        let csrfStatus
        try { ({ status: csrfStatus } = await checkToken(csrfToken, config.apiKey)) }
        catch (error) { return [500, { message: "Internal server error" }, "application/json"] }
        if (csrfStatus === "invalid") {
            return [400, { message: "Invalid CSRF token" }, "application/json"]
        }
        else if (csrfStatus === "expired") {
            return [401, { message: "Expired CSRF token" }, "application/json"]
        }

        const model = context.config["user/model"]

        // Check if user exists and email matches
        const [result] = (await db.execute(select("user", ["id", "email", "password", "password_token_hash", "last_login", "last_updated", "login_failed"], { "id": payload.userId }, null, null, model)))
        const user = result[0]
        if (!user) return throwUnauthorized("Unauthorized")
        if (user.email !== email) return throwUnauthorized("Unauthorized")

        // Check if token matches the hash in the database
        const hash = crypto.createHash("sha256").update(token).digest("hex")
        if (user.password_token_hash !== hash) {
            return [410, { message: "Invalid token" }, "application/json"]
        }

        // Update user password
        const rule = new RegExp(( config.passwordRule || context.config["user/password"]["rule"]).slice(1, -1))
        if (!rule.test(newPassword)) return [422, { message: "Password does not meet the required criteria" }, "application/json"]
        const encryptedPassword = await encryptPassword(newPassword)
        const last_updated = new Date().toISOString().slice(0, 19).replace("T", " ")
        await db.execute(update("user", [user.id], { status: "active", password: encryptedPassword, password_token_hash: "", last_updated }, model, user))

        res.clearCookie("session")

        return [200, { message: "Password updated successfully" }, "application/json"]
    }
    catch (error) { 
        console.error(error)
        return [500, { message: "Internal server error" }, "application/json"]
    }
}

module.exports = {
    newPasswordPost
}