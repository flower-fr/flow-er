const { createToken, checkToken } = require("../../../core/tools/security")

const createCsrfToken = async ({ res }, context, { config, logger }) => {
    const token = createToken({}, config.jwtCsrfSecret, config.jwtCsrfExpirationTime)

    res.cookie("csrfToken", token, {
        httpOnly: true,
        secure: true, 
        sameSite: "strict",
        path: "/",
        maxAge: config.jwtCsrfExpirationTime
    })

    logger && logger.debug("CSRF token created and set in cookie")
    return [200, { message: "CSRF token created successfully" }, "application/json"]
}

/**
 * Creates a CSRF-protected handler which validates the CSRF token
 * stored in the `csrfToken` cookie before executing it.
 *
 * @param {object} config - Application configuration.
 * @param {string} config.jwtCsrfSecret - Secret used to verify the CSRF JWT.
 * @param {object} logger
 * @returns {Function} A function that takes a route handler and returns a CSRF-protected handler.
 *
 * @example
 * const csrfGuard = createCsrfGuard(config, logger)
 * app.post("/core/v1/:entity", execute(csrfGuard(postAction), context, deps))
 */
const createCsrfGuard = (config, logger) => (handler) => {
    return async ({req, res}, ...args) => {
        const token = req.cookies?.csrfToken

        if (!token) {
            logger && logger.debug("Missing CSRF token in request")
            return [403, { error: "Missing CSRF token" }, "application/json"]
        }

        let { status } = await checkToken(token, config.jwtCsrfSecret)
        if (status === "invalid" || status === "expired") {
            logger && logger.debug(`CSRF token validation failed: ${status}`)
            return [403, { error: "Invalid or expired CSRF token" }, "application/json"]
        }

        logger && logger.debug("CSRF token validated successfully")
        return handler({req, res}, ...args)
    }
}

module.exports = {
    createCsrfToken,
    createCsrfGuard
}
