const moment = require("moment")
const util = require("util")

const { checkToken } = require("../../../../core/tools/security")
const { createAccessToken } = require("./utils/createAccessToken")

const refreshToken = async ({ req, res }, context, config, sql, logger) =>
{
    const token = req.cookies.refresh
    if (!token) {
        return false
    }

    try {
        const { status, payload } = await checkToken(token, config.jwtRefreshSecret)
        logger && logger.debug(util.inspect({ token, status, payload }))
        
        if (status === "invalid") {
            logger && logger.debug("Invalid refresh token")
            return false
        }
        else if (status === "expired") {
            logger && logger.debug("Expired refresh token")
            return false
        }
        else if (status === "ok") {
            if (payload.status === "expired") {
                logger && logger.debug("Expired password")
                return false
            }

            // Check the validity in database of the refresh token
            const user = await sql.execute({ context, type: "select", entity: "user", columns: ["id", "refresh_token_expires_at"], where: { id: payload.id } })[0]
            if (user.refresh_token_expires_at < moment().format("YYYY-MM-DD HH:mm:ss")) {
                logger && logger.debug("Token expired in database")
                return false
            }

            return await createAccessToken(context, config, { id: payload.id }, sql)
        }
        else {
            return false
        }
    }
    catch (error) {
        console.log({ error })
        return false
    }
}

module.exports = {
    refreshToken
}