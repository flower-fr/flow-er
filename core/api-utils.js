const fs = require("fs")
const path = require("path")
const Busboy = require("busboy")
const { v4: uuid } = require("uuid")

const { STATUS_CODES } = require("http")

const executeService = (config, logger) => (service, ...args) => async (req, res) => {
    if (typeof service !== "function") {
        const message = `unknown service ${service ? service.toString() : service}`
        logger.error(message)
        return res.status(500).send({message})
    }
    try {
        const result = await service({req, res, config, logger}, ...args)
        if (Array.isArray(result)) {
            const [status, content, contentType] = result
            if (contentType) {
                res.setHeader("content-type", contentType)
            }
            if (content instanceof Buffer) {
                res.setHeader("content-length", result.length)
                return res.status(status).end(content)
            }
            return res.status(status).send(content)
        }
        return res.status(200).send(result)
    }
    catch (error) {
        logger.error(error)
        if (error.data) {
            logger.error(error.data)
        }
        const status = error.statusCode ? error.statusCode : 500
        const statusText = STATUS_CODES[status]
        return res.status(status).send({reason: error.message, code: error.reasonCode, statusText, status})
    }
}

const throwHttpError = (statusCode, message, reasonCode) => {
    const statusText = STATUS_CODES[statusCode]
    const error = new Error(message || statusText)
    error.statusCode = statusCode || 500
    error.reasonCode = reasonCode
    throw error
}

const throwInternalError = (message, reasonCode) => {
    throwHttpError(500, message, reasonCode)
}

const throwBadRequestError = (message, reasonCode) => {
    throwHttpError(400, message, reasonCode)
}

const throwAuthenticationRequired = (message, reasonCode) => {
    throwHttpError(401, message, reasonCode)
}

const throwUnauthorized = (message, reasonCode) => {
    throwHttpError(403, message, reasonCode)
}

const throwNotFoundError = (message, reasonCode) => {
    throwHttpError(404, message, reasonCode)
}

const throwConflictError = async (message, reasonCode) => {
    throwHttpError(409, message, reasonCode)
}

const assert = {
    notEmpty: (source, ...args) => {
        const values = []
        for (let arg of args) {
            if (!source || !source[arg]) {
                return throwBadRequestError(`missing argument '${arg}'`)
            }
            values.push(source[arg])
        }
        if (values.length == 1) {
            return values[0]
        }
        return values
    },
    in: (arg, values) => {
        let found = false
        for (let value of values) {
            if (arg === value) {
                found = true
                break;
            }
        }
        if(!found) {
            return throwBadRequestError(`bad value for argument, found: '${arg}'`)
        }
    },
    match: (arg, regexp) => {
        if(!arg || !regexp.test(arg)) {
            return throwBadRequestError(`invalid format for argument '${arg}'`)
        }
    }
}

const noCacheMiddleware = (_req, res, next) => {
    res.setHeader("Cache-Control", "no-cache, no-store")
    next()
};

const notFoundMiddleware = (_req, res) => {
    return res.status(404).send({ status: 404, statusText: "not found", reason: "not found" })
};

const handleCorsMiddleware = (req, res, next) => {
    const origin =  req.headers["origin"]
    if (origin) {
        res.setHeader("Access-Control-Allow-Origin", origin)
    }
    res.setHeader("Access-Control-Allow-Credentials", "true")
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, Cookie, Set-Cookie")
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, OPTIONS, PUT, DELETE")
    res.removeHeader("X-Powered-By")

    if ("OPTIONS" === req.method) {
        res.sendStatus(204)
    }
    else {
        next()
    }
}

const fileUploadMiddleware = (options, logger) => async (req, res, next) => {
    if (!options) {
        const reason = "missing server configuration for upload handling"
        const status = 500
        const statusText = STATUS_CODES[status]
        return res.status(status).send({reason, statusText, status})
    }

    if (req.method === "POST" && req.headers["content-type"] && req.headers["content-type"].toLowerCase().indexOf("multipart/form-data") >= 0) {
        const uploadDir = path.resolve(options.tmpDir, uuid())
        await fs.promises.mkdir(uploadDir, { recursive: true})
        req.uploadDir = uploadDir
        const busboy = new Busboy({ 
            headers: req.headers,
            limits: {
                fieldNameSize: 120
            }
        })
        res.on("close", () => {
            fs.promises.rmdir(uploadDir, { recursive: true }).catch(error => {
                logger && logger.error(error)
            })
        })

        const promises = []
        busboy.on("file", (field, file, name, encoding, mimeType) => {
            const filePath = path.resolve(uploadDir, name || field)
            const dest = fs.createWriteStream(filePath)
            const prom = new Promise((resolve, reject) => {
                let fileSizeExeeded = false
                let size = 0
                file.on("end", () => {
                    resolve({
                        field, size, name,
                        path: filePath,
                        encoding, mimeType
                    })
                })
                file.on("data", data => {
                    size += data.length
                    fileSizeExeeded = fileSizeExeeded || (options.maxFileSize && size > options.maxFileSize)
                    if (fileSizeExeeded) {
                        reject(new Error("FILE_SIZE_EXEEDED"))
                    }
                })
                file.on("error", error => {
                    reject(error)
                })
                file.pipe(dest)
            })
            prom.catch(() => {})
            promises.push(prom)
        })
        busboy.on("field", (key, value) => {
            req.body = req.body || {}
            req.body[key] = value
        })
        busboy.on("finish", async () => {
            try {
                req.files = await Promise.all(promises)
                next()
            }
            catch (error) {
                let reason = error.reason
                let status = 500
                if (error.message === "FILE_SIZE_EXEEDED") {
                    reason = "max file size exeeded"
                    status = 413
                }
                const statusText = STATUS_CODES[status]
                logger && logger.error(reason)
                return res.status(status).send({reason, statusText, status})            
            }
        })
        req.pipe(busboy)
    }
    else {
        next()
    }
}

module.exports = {
    executeService,
    noCacheMiddleware,
    notFoundMiddleware,
    handleCorsMiddleware,
    fileUploadMiddleware,
    throwAuthenticationRequired,
    throwUnauthorized,
    throwInternalError,
    throwNotFoundError,
    throwBadRequestError,
    throwConflictError,
    assert
}