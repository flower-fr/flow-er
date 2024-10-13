const { createToken, checkToken, checkPassword } = require("../../core/tools/security")
const { executeService, assert } = require("../../core/api-utils")

const DEFAULT_TOKEN_EXPIRATION_TIME = 24 * 60 * 60

const registerAuthApi = ({ config, logger, app }) => {
    const execute = executeService(config, logger)
    const prefix = `${config.prefix}/auth`
    
    app.post(`${prefix}/createtoken`, execute(createNewToken))
};

const sessionCookieMiddleware = config => async (req, res, next) => {

    const session = req.cookies["session"]
    if (!session) {
        return res.status(403).send({message: "missing cookie"})
    }

    const [schema, token] = session.split(" ")

    if (!token || schema !== "Bearer") {
        return res.status(403).send({message: "invalid credentials"})
    }

    try {
        const { status } = await checkToken(token, config.apiKey)
        if (status === "invalid") {
            return res.status(403).send({message: "invalid token"})
        }
        else if (status === "expired") {
            return res.status(401).send({message: "token expired"})
        }
        else if (status === "ok") {
            next()
        }
        else {
            return res.status(500).send({message: "server error : unknown status"})
        }
    }
    catch (error) {
        return res.status(500).send({message: error.message})
    }
}

const authTokenMiddleware = config => async (req, res, next) => {
    const authorization = req.headers["authorization"]

    if (!authorization) {
        return res.status(403).send({message: "missing token"})
    }

    const [schema, token] = authorization.split(" ")

    if (!token || schema !== "Bearer") {
        return res.status(403).send({message: "invalid credentials"})
    }

    try {
        const { status } = await checkToken(token, config.apiKey)
        if (status === "invalid") {
            return res.status(403).send({message: "invalid token"})
        }
        else if (status === "expired") {
            return res.status(401).send({message: "token expired"})
        }
        else if (status === "ok") {
            next()
        }
        else {
            return res.status(500).send({message: "server error : unknown status"})
        }
    }
    catch (error) {
        return res.status(500).send({message: error.message})
    }
}

const checkCredentials = async ({ id, password, config, logger }) => {
    if (!config.apiUserId || !config.apiUserPassword || !config.apiKey) {
        const error = new Error("invalid configuration for the auth API, missing apiUserId, apiUserPassword or apiKey")
        error.statusCode = 500
        error.reasonCode = "INVALID_CONFIGURATION"
        throw error
    }
    
    logger.debug(`verifying credentials for ${id}`)
    const decodedHash = Buffer.from(config.apiUserPassword, "base64").toString()
    
    try {
        await checkPassword(password, decodedHash)
    }
    catch (err) {
        const error = new Error(`unauthorized acces from : ${id}`)
        error.statusCode = 403
        error.reasonCode = "UNAUTHORIZED"
        throw error
    }
}

const createNewToken = async ({ req, config, logger }) => {
    const [id, password] = assert.notEmpty(req.body, "id", "password")

    await checkCredentials({ id, password, config, logger })
    const expiresIn = config.tokenExpirationTime || DEFAULT_TOKEN_EXPIRATION_TIME
    const token = createToken({ id }, config.apiKey, expiresIn)

    logger.debug(`create new token for id: ${id}`)
    return [201, {status: "ok", id, token, expiresIn}]
};

module.exports = {
    registerAuthApi,
    sessionCookieMiddleware,
    authTokenMiddleware
}