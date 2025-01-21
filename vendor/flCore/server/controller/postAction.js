const { assert } = require("../../../../core/api-utils")
const { registerSmtp } = require("../post/registerSmtp")
const { save } = require("../post/save")
const { sendSmtp } = require("../post/sendSmtp")

const { insert } = require("../../../flCore/server/model/insert")

const availableSteps = {
    registerSmtp: registerSmtp,
    save: save,
    sendSmtp: sendSmtp
}

const postAction = async ({ req }, context, { db, smtp }) => {

    const entity = assert.notEmpty(req.params, "entity")
    const config = context.config[`${entity}/groupTab/default`]
    const transaction = assert.notEmpty(req.params, "transaction")
    const steps = config.layout.posts[transaction].steps
    
    const rows = req.body.rows
    for (let row of req.body.rows) {
        for (const [propertyId, value] of Object.entries(req.body.payload)) {
            if (value) row[propertyId] = value
        }    
    }

    const connection = await db.getConnection()
    await connection.beginTransaction()

    for (let stepId of Object.keys(steps)) {
        const step = steps[stepId]
        if (!step.async) await (availableSteps[stepId])({ req }, context, rows, { connection, smtp })
    }

    await connection.commit()

    for (let stepId of Object.keys(steps)) {
        const step = steps[stepId]
        if (step.async) (availableSteps[stepId])({ req }, context, rows, { connection, smtp })
    }

    connection.release()
    
    return JSON.stringify({ "status": "ok" })
}

module.exports = {
    postAction
}