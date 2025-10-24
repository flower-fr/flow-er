const { assert } = require("../../../../core/api-utils")
const { throwBadRequestError } = require("../../../../core/api-utils")

const transactionAction = async ({ req }, context, { sql, smtp, sms }) => {

    const entity = assert.notEmpty(req.params, "entity")
    const view = req.query.view
    let config 
    if (view) config = context.config[`${entity}/groupTab/${ view }`]
    if (!config) config = context.config[`${entity}/groupTab/default`]
    const transaction = assert.notEmpty(req.params, "transaction")
    const id = req.params.id
    const steps = config.layout.posts[transaction].steps
    
    let rows
    if (req.body.rows) rows = req.body.rows // Batch upsert
    else if (id) rows = [{"id": id}] // unitary update
    else rows = [{}] // unitary insert

    for (let row of rows) {
        for (const [propertyId, value] of Object.entries((req.body.payload) ? req.body.payload : req.body)) {
            if (value) row[propertyId] = value
        }    
    }

    //const connection = await db.getConnection()
    // try {
        // await connection.beginTransaction()
        await sql.beginTransaction()
    
        for (const [stepId, step] of Object.entries(steps)) {
            const stepFunction = context.config.postSteps[stepId]
            if (!step.async) await stepFunction({ req, entity }, context, rows, { sql, smtp, sms })
        }
    
        // await connection.commit()
        await sql.commit()
    
        for (let stepId of Object.keys(steps)) {
            const step = steps[stepId]
            const stepFunction = context.config.postSteps[stepId]
            if (step.async) stepFunction({ req, entity }, context, rows, { sql, smtp, sms })
        }
    
        // connection.release()
        
        return JSON.stringify({ "status": "ok" })    
    // }
    // catch {
    //     // await connection.rollback()
    //     await sql.rollback()
    //     // connection.release()
    //     throw throwBadRequestError()
    // }
}

module.exports = {
    transactionAction
}