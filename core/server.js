const express = require("express")
const bodyParser = require("body-parser")
const moment = require("moment")
const compression = require("compression")
const cookieParser = require("cookie-parser")

const startServer = async (context, config, logger) => {
    if (!context || !config || ! config.server || !logger) {
        throw new Error("Missing server configuration")
    }
    const bindAddress = config.server.bindAddress
    const listenPort = config.server.listenPort

    const app = express()

    app.use(compression())
    app.use(cookieParser())
    app.use("/", express.static("./public/"))

    app.disable("x-powered-by")
    app.set("trust proxy", true)
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(loggerMiddleware(logger))
    
    app.use((req, res, next) => {
        // HSTS
        res.setHeader("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload")

        // CSP
        res.setHeader(
            "Content-Security-Policy",
            "object-src 'none'; frame-ancestors 'none'; upgrade-insecure-requests"
        )

        // X-Frame-Options
        res.setHeader("X-Frame-Options", "SAMEORIGIN")

        // Autres en-têtes
        res.setHeader("X-Content-Type-Options", "nosniff")
        res.setHeader("X-XSS-Protection", "1; mode=block")
        res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin")

        next()
    })

    await registerMiddlewares(context, config, logger, app)

    logger.info("starting server...")
    app.listen(listenPort, bindAddress, () => {
        logger.info(`server running on port ${bindAddress}:${listenPort}`)
    })
}

const registerMiddlewares = async (context, config, logger, app) => {
    const middlewares = config.server.middlewares
    if (!middlewares) {
        return
    }
    
    for (let key of Object.keys(middlewares)) {
        const middleware = require(middlewares[key].dir)
        if (typeof middleware.register === "function") {
            if (middlewares[key].status !== "disabled") {
                app.use(`${middlewares[key].prefix}cli/`, express.static(`./vendor/${key}/client/`))
                app.use(`${middlewares[key].prefix}cli/`, express.static(`./module/${key}/client/`))
                await middleware.register({context, config: middlewares[key], logger, app})    
            }
        }
        else {
            throw new Error(`invalid middleware for key ${key}, please check for function "register"`)
        }
    }
}

const loggerMiddleware = logger => (req, res, next) => {
    res.on("finish", () => {
        const ip = req.connection.remoteAddress
        const date = moment().format("DD/MMM/YYYY:hh:mm:ss")
        const request = `"${req.method} ${req.url} HTTP/${req.httpVersion}"`
        const status = res.statusCode
        logger && logger.info(`${ip} - - [${date}] ${request} ${status}`)
    })
    next()
}

module.exports = {
    startServer
}
