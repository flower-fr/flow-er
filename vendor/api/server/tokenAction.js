const util = require("util")
const { checkPassword, checkToken, createToken } = require("../../../core/tools/security")

const tokenAction = async ({ req }, context, config, { sql, logger }) => 
{
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith("Basic ")){
        return [401, { error: "invalid_client", message: "Missing or malformed authorization header." }, "application/json"]
    }

    try {
        const base64Credentials = authHeader.split(" ")[1]
        const credentials = Buffer.from(base64Credentials, "base64").toString("ascii")
    
        const index = credentials.indexOf(":")
        if (index === -1) {
            return [401, { error: "invalid_client", message: "Invalid credentials format." }, "application/json"]
        }

        const clientId = credentials.slice(0, index)
        const clientSecret = credentials.slice(index + 1)

        const result = await sql.execute({ context, type: "select", entity: "user", columns: ["id", "status", "email", "locale", "password", "last_login", "last_updated", "login_failed"], where: { email: clientId } })
        logger && logger.debug(util.inspect({result}, {depth: null, colors: true}))
        const user = result[0]
        if (!user) {
            return [401, { error: "invalid_client", message: "User not exists" }, "application/json"]
        }

        // Check user exists and password matches

        const userData = {}
        const authorized = await checkPassword(clientSecret, user.password)
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
            return [401, { error: "invalid_client", message: "Unauthorized" }, "application/json"]
        }

        // Check user is active

        if (user.status !== "active") {
            return [403, { error: "invalid_client", message: "User is not active." }, "application/json"]
        }

        // New token

        return createToken({ user_id: user.id }, config.apiKey, config.apiJwtExpirationTime)

    } catch (error) {
        return [401, { error: "invalid_client", message: "Invalid credentials format." }, "application/json"]
    }
}

module.exports = {
    tokenAction
}