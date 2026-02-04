const { assert } = require("../../../core/api-utils")
const { throwBadRequestError } = require("../../../core/api-utils")
const util = require("util")

const { dataToStore } = require("./model/dataToStore")
const { entitiesToStore } = require("./model/entitiesToStore")
const { storeEntities } = require("./post/storeEntities")
const { auditCells } = require("./post/auditCells")

const { addEvent } = require("./post/addEvent")
const { registerHistory } = require("./post/registerHistory")
const { registerSmtp } = require("./post/registerSmtp")
const { registerSms } = require("./post/registerSms")
const { save } = require("./post/save")
const { sendSmtp } = require("./post/sendSmtp")
const { sendSms } = require("./post/sendSms")

const postAction = async ({ req }, context, { sql, logger }) => {
    const entity = assert.notEmpty(req.params, "entity")
    const id = (req.query.id) ? req.query.id : 0

    try {
        await sql.beginTransaction()

        const model = context.config[`${entity}/model`]
        logger && logger.debug(util.inspect({model}))

        const form = req.body
        if (id !== 0) {
            if (form.length > 1) {
                throw throwBadRequestError("Cannot specify id for multiple entities")
            }
            form[0].id = id
        }
        logger && logger.debug(util.inspect({form}))

        /**
         * Find out the data to actually store in the database 
         */

        let { rowsToStore, rowsToReject } = dataToStore(model, form)
        logger && logger.debug(util.inspect({rowsToStore, rowsToReject}))

        if (rowsToReject.length > 0) {
            return JSON.stringify({ "status": "ko", "errors": rowsToReject })
        }
        
        /**
         * Find out the entities to insert vs update in the database 
         */

        rowsToStore = entitiesToStore(entity, model, rowsToStore)
        logger && logger.debug(util.inspect({rowsToStore}))
console.log(rowsToStore)
return
        /**
         * Apply and audit the changes in the database
         */
        await storeEntities(context, entity, rowsToStore, model, sql)
        await auditCells(context, rowsToStore, sql)

        await sql.commit()
        return JSON.stringify({ "status": "ok", "stored": rowsToStore })
    }
    catch (err) {
        logger && logger.debug(util.inspect(err))
        await sql.rollback()
        throw throwBadRequestError()
    }
}

const postFormAction = async ({ req }, context, { sql, smtp, logger }) => {
    const entity = assert.notEmpty(req.params, "entity")
    const transaction = req.params.transaction, id = (req.query.id) ? req.query.id : 0
    const form = [req.body]

    const file = req.file && req.file.buffer

    let rows
    const fileRow = {}
    
    if (file) {
        fileRow.data = file
        fileRow.name = req.file.originalname
        fileRow.mime = req.file.mimetype
    }

    if (form[0].rows) rows = JSON.parse(form[0].rows) // Batch upsert
    else if (id) rows = [{"id": id}] // unitary update
    else rows = [{}] // unitary insert

    for (let row of rows) {
        for (const [propertyId, value] of Object.entries(form[0])) {
            if (propertyId !== "rows") {
                if (value) row[propertyId] = value
            }
        }    
    }

    const postSteps = { addEvent, registerHistory, registerSmtp, registerSms, save, sendSmtp, sendSms }
    const steps = (transaction === "sendEmail") ? { registerSmtp: {}, sendSmtp: { entity: "interaction", async: true } } : { save: { entity } }

    try {
        await sql.beginTransaction()

        /**
         * Insert attachment
         */

        if (file) {
            const data = [{ entitiesToInsert: { document_binary: { cells: fileRow }}, entitiesToUpdate: {} }]
            await storeEntities(context, "document_binary", data, context.config["document_binary/model"], sql)
            for (let row of rows) {
                row.attachments = (row.attachments) ? row.attachments + "," : "" 
                row.attachments += `${data[0].entitiesToInsert.document_binary.rowId}`
            }
        }
    
        for (const [stepId, step] of Object.entries(steps)) {
            const stepFunction = postSteps[stepId]
            if (!step.async) await stepFunction({ req, entity: step.entity }, context, rows, { sql, smtp })
        }
    
        await sql.commit()
    
        for (const [stepId, step] of Object.entries(steps)) {
            const stepFunction = postSteps[stepId]
            if (step.async) stepFunction({ req, entity: step.entity }, context, rows, { sql, smtp })
        }
    
        return JSON.stringify({ "status": "ok" })    
    }
    catch (err) {
        logger && logger.debug(util.inspect(err))
        await sql.rollback()
        throw throwBadRequestError()
    }
}

module.exports = {
    postAction,
    postFormAction
}