const { assert } = require("../../../../core/api-utils")
const { throwBadRequestError } = require("../../../../core/api-utils")
const util = require("util")

const { dataToStore } = require("../model/dataToStore")
const { entitiesToStore } = require("../model/entitiesToStore")
const { storeEntities } = require("../post/storeEntities")
const { auditCells } = require("../post/auditCells")

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

const postFormAction = async ({ req }, context, { sql, logger }) => {
    const entity = assert.notEmpty(req.params, "entity")
    const id = (req.query.id) ? req.query.id : 0

    try {
        await sql.beginTransaction()

        const model = context.config[`${entity}/model`]
        const form = [req.body]

        const file = req.file && req.file.buffer
        if (file) {
            form[0].data = file
            form[0].name = req.file.originalname
            form[0].mime = req.file.mimetype
        }

        logger && logger.debug(util.inspect({form}))

        /**
         * Find out the data to actually store in the database 
         */

        let { rowsToStore, rowsToReject } = dataToStore(model, form)
        if (rowsToReject.length > 0) {
            return JSON.stringify({ "status": "ko", "errors": rowsToReject })
        }

        /**
         * Find out the entities to insert vs update in the database 
         */

        rowsToStore = entitiesToStore(entity, model, rowsToStore)

        /**
         * Apply and audit the changes in the database
         */
        await storeEntities(context, entity, rowsToStore, model, sql)
        await auditCells(context, rowsToStore, sql)

        await sql.commit()
        return JSON.stringify({ "status": "ok", "stored": rowsToStore })
    }
    catch (err)  {
        logger && logger.debug(util.inspect(err))
        await sql.rollback()
        throw throwBadRequestError()
    }
}

module.exports = {
    postAction,
    postFormAction
}