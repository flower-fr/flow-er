const { insert } = require("../model/insert")

const addEvent = async ({ req, entity }, context, rows, { connection }) => {

    /**
     * Create an event and attendeeslinks
     */

    const eventData = {
        status: "todo",
        chanel: "evenement",
        summary: req.body.payload.summary,
        description: req.body.payload.description,
        date: req.body.payload.date,
        time: req.body.payload.time
    }
    const [insertedRow] = await connection.execute(insert(context, entity, eventData, context.config[`${ entity }/model`]))
    const event_id = insertedRow.insertId   

    for (let row of req.body.rows) {

        const linkData = {
            event_id,
            account_id: row.id
        }

        await connection.execute(insert(context, "crm_event_account", linkData, context.config["crm_event_account/model"]))
        row.insertId = insertedRow.insertId   
    }
}

module.exports = {
    addEvent
}