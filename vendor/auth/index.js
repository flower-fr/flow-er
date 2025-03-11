const { noCacheMiddleware, notFoundMiddleware, handleCorsMiddleware } = require("../../core/api-utils")
const { createToken, checkToken, checkPassword, getTokenPayload } = require("../../core/tools/security")
const { executeService, assert } = require("../../core/api-utils")

const { createDbClient } = require("../utils/db-client")
const { select } = require("../flCore/server/model/select")

const DEFAULT_TOKEN_EXPIRATION_TIME = 24 * 60 * 60

const register = async ({ context, config, logger, app }) => {

    const db = await createDbClient(config.db, context.dbName)

    const execute = executeService(context.clone(), config, logger)

    app.use(`${config.prefix}/*`, noCacheMiddleware)
    app.use(`${config.prefix}/*`, handleCorsMiddleware)
    app.post(`${config.prefix}createtoken`, execute(createNewToken, context, db))
    app.use(`${config.prefix}/`, notFoundMiddleware)
}

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

const authTokenMiddleware = (config, context) => async (req, res, next) => {
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
            const payload = getTokenPayload(token)
            context.user.formattedName = `${payload.n_first} ${payload.n_last}`
            context.user.roles = (payload.role) ? payload.role.split(",") : []
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

const createNewToken = async ({ req, config, logger }, context, db) => {
    const [id, password] = assert.notEmpty(req.body, "id", "password")

    await checkCredentials({ id, password, config, logger })

    // New token

    const payloadModel = config.tokenPayloadModel
    const filters = {}
    filters[payloadModel.key] = id
    const profileModel = {
        "entities": {},
        "properties": {}
    }
    for (let propertyId of payloadModel.columns) {
        profileModel.properties[propertyId] = { "entity": payloadModel.entity, "column": propertyId }
    }
    const [rows] = await db.execute(select(context, payloadModel.entity, payloadModel.columns, filters, null, null, profileModel))
    const profile = rows[0]

    const expiresIn = config.tokenExpirationTime
    const token = createToken(profile, config.apiKey, expiresIn)


    logger.debug(`create new token for id: ${id}`)
    return [201, {status: "ok", id, token, expiresIn}]
}

module.exports = {
    register,
    sessionCookieMiddleware,
    authTokenMiddleware
}