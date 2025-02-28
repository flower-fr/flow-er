const { assert } = require("../../../../core/api-utils")
const { throwBadRequestError } = require("../../../../core/api-utils")
const { registerSmtp } = require("../post/registerSmtp")
const { registerSms } = require("../post/registerSms")
const { save } = require("../post/save")
const { sendSmtp } = require("../post/sendSmtp")
const { sendSms } = require("../post/sendSms")

const availableSteps = {
    registerSmtp: registerSmtp,
    registerSms: registerSms,
    save: save,
    sendSmtp: sendSmtp,
    sendSms: sendSms
}

const transactionAction = async ({ req }, context, { db, smtp, sms }) => {

    const entity = assert.notEmpty(req.params, "entity")
    const config = context.config[`${entity}/groupTab/default`]
    const transaction = assert.notEmpty(req.params, "transaction")
    const id = req.params.id
    const steps = config.layout.posts[transaction].steps
    
    let rows
    if (id) rows = [{"id": id}] 
    else rows = req.body.rows
    for (let row of rows) {
        for (const [propertyId, value] of Object.entries(req.body.payload)) {
            if (value) row[propertyId] = value
        }    
    }

    const connection = await db.getConnection()
    try {
        await connection.beginTransaction()
    
        for (const [stepId, step] of Object.entries(steps)) {
            console.log(stepId)
            if (!step.async) await (availableSteps[stepId])({ req }, context, rows, { connection, smtp, sms })
        }
    
        await connection.commit()
    
        for (let stepId of Object.keys(steps)) {
            console.log(stepId)
            const step = steps[stepId]
            if (step.async) (availableSteps[stepId])({ req }, context, rows, { connection, smtp, sms })
        }
    
        connection.release()
        
        return JSON.stringify({ "status": "ok" })    
    }
    catch {
        await connection.rollback()
        connection.release()
        throw throwBadRequestError()
    }
}

module.exports = {
    transactionAction
}