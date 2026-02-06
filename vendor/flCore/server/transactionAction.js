const { throwBadRequestError } = require("../../../core/api-utils")
const util = require("util")

const { addEvent } = require("./post/addEvent")
const { registerHistory } = require("./post/registerHistory")
const { registerSmtp } = require("./post/registerSmtp")
const { registerSms } = require("./post/registerSms")
const { save } = require("./post/save")
const { sendSmtp } = require("./post/sendSmtp")
const { sendSms } = require("./post/sendSms")

const transactionAction = async ({ req }, context, { sql, smtp, sms, logger }) => {

    const id = req.params.id
    
    let rows
    if (req.body.rows) rows = req.body.rows // Batch upsert
    else if (id) rows = [{"id": id}] // unitary update
    else rows = [{}] // unitary insert

    for (let row of rows) {
        for (const [propertyId, value] of Object.entries((req.body.payload) ? req.body.payload : req.body)) {
            if (value) row[propertyId] = value
        }    
    }

    const postSteps = { addEvent, registerHistory, registerSmtp, registerSms, save, sendSmtp, sendSms }

    try {
        await sql.beginTransaction()
    
        for (const step of req.body.steps) {
            const stepId = step.id, stepFunction = postSteps[stepId]
            const data = rows.map(row => {
                const dataRow = {}
                for (const [key, value] of Object.entries(step.properties)) {
                    dataRow[key] = (key === "owner_id") ? context.user.profile_id : row[value] 
                }
                return dataRow
            })
            if (!step.async) await stepFunction({ req, entity: step.entity }, context, data, { sql, smtp, sms })
        }
    
        await sql.commit()
    
        for (const [stepId, step] of Object.entries(req.body.steps)) {
            const stepFunction = postSteps[stepId]
            if (step.async) stepFunction({ req, entity: step.entity }, context, rows, { sql, smtp, sms })
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
    transactionAction
}