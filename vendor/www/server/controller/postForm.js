const { assert } = require("../../../../core/api-utils")
const moment = require("moment")
const util = require("util")

const { throwBadRequestError } = require("../../../../core/api-utils")

const { dataToStore } = require("../../../flCore/server/model/dataToStore")
const { entitiesToStore } = require("../../../flCore/server/model/entitiesToStore")
const { storeEntities } = require("../../../flCore/server/post/storeEntities")
const { auditCells } = require("../../../flCore/server/post/auditCells")
const { log } = require("console")

const postForm = async ({ req }, context, config, sql, logger) => {
    const entity = assert.notEmpty(req.params, "entity")
    const form = req.body

    let status = "ok"

    try {

        /**
         * Recaptcha
         */
        const interactionParams = {}
        const response = await fetch(`https://recaptchaenterprise.googleapis.com/v1/projects/double-cream/assessments?key=${ config.googleApiKey }`, {
            method: "POST",
            body: JSON.stringify({
                "event": {
                    "token": form.gRecaptchaResponse,
                    "siteKey": config.recaptchaToken,
                }
            })
        })
        const recaptchaJson = await response.json()
        interactionParams.recaptcha = recaptchaJson
        if (!recaptchaJson.riskAnalysis || recaptchaJson.riskAnalysis.score < 0.3 ) status = "unprocessable"

        if (status === "ok") {
            /**
             * Emailable
             */
            const emailableResponse = await fetch(`https://api.emailable.com/v1/verify?email=${ form.email }&api_key=${ config.emailableApiKey }`)
            const emailableJson = await emailableResponse.json()
            interactionParams.emailable = emailableJson
            if (emailableJson.state !== "deliverable") status = "undelivrable"
        }

        /**
         * Log interaction
         */
        const interactionModel = context.config["interaction/model"]

        let data = {
            status: "new",
            provider: "www.double-cream.com",
            endpoint: "/",
            method: "POST",
            params: JSON.stringify(interactionParams)
        }
        await sql.execute({ context, type: "insert", entity: "interaction", data, model: interactionModel })

        /**
         * Check validity
         */
        if (status === "unprocessable" ) {
            return JSON.stringify({ status: "unprocessable"})
        } 
        else if (status === "undelivrable" ) {
            return JSON.stringify({ status: "undelivrable"})
        } 

        /**
         * Process the request
         */
        await sql.beginTransaction()

        form.status = "new"
        form.callback_date = moment().add(1, "days").format("YYYY-MM-DD")
        form.chanel = "web"
        form.direction = "inbound"
        form.summary = `Site web: ${ form.description && form.description.substring(0, 246) }`
        form.date = moment().add(1, "days").format("YYYY-MM-DD")
        form.owner_id = 1

        const model = context.config[`${entity}/model`]
        // const [rows] = (await connection.execute(select(context, entity, ["id", "n_first", "email"], { "n_first": form.n_first, "email": form.email }, null, null, model)))
        const rows = await sql.execute({ context, type: "select", entity, columns: ["id", "n_first", "email"], where: { "n_first": form.n_first, "email": form.email }, model })

        if (rows.length > 0) {
            form.id = rows[0].id
        }

        let { rowsToStore } = dataToStore(model, [form])
        
        /**
         * Find out the entities to insert vs update in the database 
         */

        rowsToStore = entitiesToStore(entity, model, rowsToStore)
        logger && logger.debug(util.inspect(rowsToStore))

        /**
         * Apply and audit the changes in the database
         */
        await storeEntities(context, entity, rowsToStore, model, sql)
        await auditCells(context, rowsToStore, sql)

        await sql.commit()
    }
    catch (err) {
        logger && logger.debug(util.inspect(err))
        await sql.rollback()
        throw throwBadRequestError()
    }

    return JSON.stringify({ status: "ok"})
}

module.exports = {
    postForm
}