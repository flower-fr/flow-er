const { checkToken } = require("../../../core/tools/security")

const apiTokenMiddleware = (config, context, sql, logger) => async (req, res, next) =>
{
    const authHeader = req.headers["authorization"]
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Missing token" })
    }
    const token = authHeader.split(" ")[1]
    try {
        const { status, payload } = await checkToken(token, config.apiKey)
        if (status === "invalid") {
            return res.status(401).json({ error: "Invalid token." })
        }
        else if (status === "expired") {
            return res.status(401).json({ error: "Token has expired." })
        }
        else if (status === "ok") {
            context.user.role = "api"
            next()
        }
        else {
            return res.status(401).json({ error: "Invalid token." })
        }
    }
    catch (error) {
        return res.status(400).json({ error: "Invalid request" })
    }
}

module.exports = {
    apiTokenMiddleware
}