const { assert } = require("../../../../core/api-utils")
const multer = require("multer")

const { sessionCookieMiddleware } = require("../../../user/server/controller/sessionCookieMiddleware");
const { createDbClient } = require("../../../utils/db-client")
const { executeService } = require("../../../../core/api-utils")
const { throwBadRequestError } = require("../../../../core/api-utils")

const { ddlEntity } = require("./ddl")
const { loadAll } = require("./load")
const { modelRelease } = require("./model")
const { getNotifRules, postNotifRules } = require("./notifRules")

const registerStudio = async ({ context, config, logger, app }) => {
    const db = await createDbClient(config.db, context.dbName)
    const execute = executeService(context.clone(), config, logger)
    const executeImport = async (req, res) => {
        if (!context.isAllowed("document_binary")) return res.status(403).send({message: "unauthorized"})
        const result = await postImportAction({ req }, context, db)
        return res.status(200).send(result)
    }
    const upload = multer()
    
    app.use(`${config.prefix}`, sessionCookieMiddleware(config, context))
    app.get(`${config.prefix}ddl/:entity`, execute(ddl, context, db))
    app.get(`${config.prefix}ddl/:entity/:property`, execute(ddl, context, db))
    app.get(`${config.prefix}model/:module/:release`, execute(model, context, db))
    app.post(`${config.prefix}model/:module/:release`, execute(postModel, context, db))

    app.get(`${config.prefix}notifRules/:entity`, execute(getNotifRules, context, db))
    app.post(`${config.prefix}notifRules/:entity`, execute(postNotifRules, context, db))
    app.post(`${config.prefix}notifRules/:entity`, upload.single("file"), executeImport)
}

const ddl = async ({ req }, context, db) => {
    const entity = assert.notEmpty(req.params, "entity")
    const propertyId = req.params.property
    let ddl = []
    ddl.push("SET SQL_MODE = \"NO_AUTO_VALUE_ON_ZERO\";")
    ddl.push("START TRANSACTION;")
    ddl.push("SET time_zone = \"+00:00\";\n")
    ddl = ddl.concat(ddlEntity(context, entity, propertyId))
    ddl = ddl.concat(loadAll(context, entity))
    ddl.push("COMMIT;")
    return ddl.join("\n")
}

const model = async ({ req }, context) => {
    const module = assert.notEmpty(req.params, "module")
    const release = req.params.release
    
    let ddl = []
    ddl.push("SET SQL_MODE = \"NO_AUTO_VALUE_ON_ZERO\";")
    ddl.push("START TRANSACTION;")
    ddl.push("SET time_zone = \"+00:00\";\n")
    ddl = ddl.concat(modelRelease(context, module, release))
    ddl.push("COMMIT;")
    return ddl.join("\n")
}

const postModel = async ({ req }, context, db) => {
    const module = assert.notEmpty(req.params, "module")
    const release = req.params.release
    
    let ddl = []
    ddl.push("SET SQL_MODE = \"NO_AUTO_VALUE_ON_ZERO\";")
    ddl.push("SET time_zone = \"+00:00\";\n")
    ddl = ddl.concat(modelRelease(context, module, release))
    const connection = await db.getConnection()
    try {
        await connection.beginTransaction()

        for (const request of ddl) await db.execute(request)

        await connection.commit()
        connection.release()
    }
    catch {
        await connection.rollback()
        connection.release()
        throw throwBadRequestError()
    }
}

module.exports = {
    registerStudio
}