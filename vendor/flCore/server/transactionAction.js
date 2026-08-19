const { throwBadRequestError } = require("../../../core/api-utils")
const util = require("util")

const { addEvent } = require("./post/addEvent")
const ensure = require("./post/ensure")
const { registerHistory } = require("./post/registerHistory")
const { registerSmtp } = require("./post/registerSmtp")
const { registerSms } = require("./post/registerSms")
const { save } = require("./post/save")
const { sendSmtp } = require("./post/sendSmtp")
const { sendSms } = require("./post/sendSms")

const transactionAction = async ({ req }, context, { sql, smtp, sms, logger }) =>
{
    const entity = req.params.entity
    const id = req.params.id
    const postSteps = { addEvent, ensure, registerHistory, registerSmtp, registerSms, save, sendSmtp, sendSms }

    try {
        await sql.beginTransaction()
    
        const result = {}
        let insertId
        for (const step of req.body.steps) {
    
            let rows
            if (req.body.rows) rows = req.body.rows // Batch upsert
            else if (id) rows = [{"id": id}] // unitary update
            else rows = [{}] // unitary insert

            // for (let row of rows) {
            //     for (const [propertyId, value] of Object.entries((req.body.payload) ? req.body.payload : req.body)) {
            //         if (value) row[propertyId] = value
            //     }    
            // }

            const stepId = step.id, stepFunction = postSteps[stepId]
            const data = rows.map(row => {
                const dataRow = {}
                for (const [key, value] of Object.entries(step.properties)) {
                    if (key !== "id" && value === "id" && !row[value]) {
                        dataRow[key] = insertId
                    } else {
                        dataRow[key] = (key === "owner_id") ? context.user.profile_id : row[value]
                    }
                }
                return dataRow
            })
            result[stepId] = data
            if (!step.async) {
                const result = await stepFunction({ req, step, entity: step.entity }, context, data, { sql, smtp, sms, logger })
                result.stored.forEach(row => {
                    if (row.entitiesToInsert && row.entitiesToInsert[entity]) insertId = row.entitiesToInsert[entity].rowId
                })
            }
        }
    
        await sql.commit()
    
        for (const [stepId, step] of Object.entries(req.body.steps)) {
    
            let rows
            if (req.body.rows) rows = req.body.rows // Batch upsert
            else if (id) rows = [{"id": id}] // unitary update
            else rows = [{}] // unitary insert

            const stepFunction = postSteps[stepId]
            if (step.async) stepFunction({ req, step, entity: step.entity }, context, rows, { sql, smtp, sms, logger })
        }
    
        return JSON.stringify({ "status": "ok", result })    
    }
    catch (err) {
        logger && logger.debug(err)
        await sql.rollback()
        throw throwBadRequestError()
    }
}

module.exports = {
    transactionAction
}