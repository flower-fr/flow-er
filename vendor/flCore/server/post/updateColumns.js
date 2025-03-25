const moment = require("moment")

const { select } = require("../../../flCore/server/model/select")
const { updateCase } = require("../../../flCore/server/model/updateCase")
const { insert } = require("../../../flCore/server/model/insert")

const updateColumns = async (context, columnsToUpdate, model, db) => {
    
    const columnsToRetrieve = {}
    for (const [table, columns] of Object.entries(columnsToUpdate)) {
        columnsToRetrieve[table] = { columns: ["id"], ids: [] }
        for (const [column, pairs] of Object.entries(columns)) {
            columnsToRetrieve[table].columns.push(column)
            for (const id of Object.keys(pairs)) {
                if (!columnsToRetrieve[table].ids.includes(id)) columnsToRetrieve[table].ids.push(id)
            }
        }
    }

    for (const [table, object] of Object.entries(columnsToRetrieve)) {
        const model = context.config[`${ table }/model`]
        const rows = {}, [cursor] = await db.execute(select(context, table, object.columns, {id: object.ids}, null, null, model))
        for (const row of cursor) {
            for (const [key, value] of Object.entries(row)) {
                if (model.properties[key].type && model.properties[key].type == "date") row[key] = moment(value).format("YYYY-MM-DD")
            }
            rows[row.id] = row
        }
        object.rows = rows
    }

    const cellsToUpdate = {}
    for (const [table, columns] of Object.entries(columnsToUpdate)) {
        cellsToUpdate[table] = {}
        for (const [column, pairs] of Object.entries(columns)) {
            cellsToUpdate[table][column] = new Map()
            for (const [key, value] of Object.entries(pairs)) {
                const row = columnsToRetrieve[table].rows[key]
                if (row[column] != value) cellsToUpdate[table][column].set(key, { "old": row[column], "new": value })
            }
        }
    }

    /**
     * Update existing entities
     */
    for (const [entity, columns] of Object.entries(cellsToUpdate)) {
        const model = context.config[`${ entity }/model`]
        const table = model.entities[entity].table
        const auditTable = (model.audit) ? model.audit : "audit", auditModel = context.config[`${auditTable}/model`]

        for (const [column, map] of Object.entries(columns)) {
            if (map.size > 0) {
                const pairs = Array.from(map).map(([key, values]) => [key, values.new])
                await db.execute(updateCase(context, table, column, Object.fromEntries(pairs), model))

                const property = model.properties[column]
                if (property.audit) {
                    for (const [key, values] of map) {
                        const auditToInsert = {
                            entity: table,
                            row_id: key,
                            property: column,
                            value: values.new,
                            previous_value: values.old
                        }
                        await db.execute(insert(context, auditTable, auditToInsert, auditModel))    
                    }
                }
            }
        }
    }

    return cellsToUpdate
}

module.exports = {
    updateColumns
}