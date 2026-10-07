const { dataToStore } = require("../../../../vendor/flCore/server/model/dataToStore")
const { entitiesToStore } = require("../../../../vendor/flCore/server/model/entitiesToStore")
// const { storeEntities } = require("../../../../vendor/flCore/server/post/storeEntities")
// const { auditCells } = require("../../../../vendor/flCore/server/post/auditCells")
const { storeEntities } = require("./storeEntities")
const { auditCells } = require("./auditCells")

const saveData = async (context, entity, form, sql) => 
{
    const model = context.config[`${entity}/model`]

    /**
     * Find out the data to actually store in the database 
     */

    let { rowsToStore, rowsToReject } = dataToStore(model, form)
    console.log("saveData : rowsToStore =", rowsToStore)
    console.log("saveData : rowsToReject =", rowsToReject)

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

    return rowsToStore
}

module.exports = {
    saveData
}