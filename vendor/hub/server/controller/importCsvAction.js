const util = require("util")
const { assert } = require("../../../../core/api-utils")
const moment = require("moment")
const utf8 = require("utf8")
const { select } = require("../../../flCore/server/model/select")
const { insert } = require("../../../flCore/server/model/insert")
const { update } = require("../../../flCore/server/model/update")
const { mergePayload } = require("../../../flCore/server/post/save")
const { dataToStore } = require("../../../flCore/server/model/dataToStore")
const { entitiesToStore } = require("../../../flCore/server/model/entitiesToStore")
const { storeEntities } = require("../../../flCore/server/post/storeEntities")
const { auditCells } = require("../../../flCore/server/post/auditCells")

/**
 * Map the payload to the model
 */

const match = (payload, importConfig) => {

    moment.locale("en")

    const valid = [], invalid = []
    for (const row of payload) {
        const validRow = {}
        const invalidRow = {}

        /**
         * Initialize default data
         */
        for (let [propertyId, def] of Object.entries(importConfig.properties)) {
            if (def.type == "default") {
                let value = def.value
                if (value.includes("today")) {
                    if (value && value.charAt(5) == "+") value = moment().add(value.substring(6), "days").format("YYYY-MM-DD")
                    else if (value && value.charAt(5) == "-") value = moment().subtract(value.substring(6), "days").format("YYYY-MM-DD")
                    else value = moment().format("YYYY-MM-DD")
                }
                validRow[propertyId] = value
            }
        }

        /**
         * Match and load the data from the form
         */

        for (let [key, value] of Object.entries(row)) {
            key = key.split(" ").join("")
            key = key.split("\n").join("")
            key = key.toLowerCase()
            if (!value) value = ""

            // Matching key
            if (importConfig.mapping[key]) {
                const matched = importConfig.mapping[key]
                if (matched.type == "select") {
                    if (Number.isInteger(value)) value = value.toString()
                    else if (value) {
                        value = value.split(" ").join("")
                        value = value.toLowerCase()    
                    }

                    if (value && matched.modalities[value]) {
                        validRow[matched["propertyId"]] = matched.modalities[value]
                    }
                    else invalidRow[matched["propertyId"]] = value
                }
                else if (matched.type == "date") {
                    if (value) {
                        value = value.split(" ").join("").toUpperCase()
                        value = moment(value, "DDMMMYYYY").format("YYYY-MM-DD")
                        validRow[matched["propertyId"]] = value
                    }
                    else validRow[matched["propertyId"]] = value
                }
                else if (matched.type == "url") {
                    validRow[matched["propertyId"]] = encodeURI(utf8.encode(value))
                }
                else if (matched.type == "text") {
                    if (Number.isInteger(value)) value = value.toString()
                    value = value.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, "")
                    value = value.replaceAll("\"", "")
                    validRow[matched["propertyId"]] = value
                }
                else validRow[matched["propertyId"]] = value
            }

            // Unmatching key
            else {
                invalidRow[key] = value
            }
        }
        let keep = true
        for (const key of importConfig.identifier) if (!validRow[key]) keep = false
        if (keep) valid.push(validRow)
        if (Object.values(invalidRow).length > 0) invalid.push(invalidRow)
    }
    return { valid, invalid }
}

/**
 * Import xlsx files
 */

const getImportCsvAction = async ({ req }, context, db) => {
    const entity = assert.notEmpty(req.params, "entity")
    const view = (req.query.view) ? req.query.view : "default"

    const importConfig = context.config[`${entity}/import/default`]

    const result = {
        layout: {
            title: { default: "Import a CSV file", fr_FR: "Importer un fichier CSV" },
            formJwt: "To be defined",
            renderer: "renderGlobal"
        },
        post: {
            controller: "hub",
            action: "import-csv",
            entity: entity,
            view: view,
            id: 0,
            labels: { default: "import", fr_FR: "Importer" },
            renderer: "renderImportCsv"
        }
    }

    const connection = await db.getConnection()

    const interactionModel = context.config["interaction/model"]
    const [cursor] = await connection.execute(select(context, "interaction", ["id", "status", "endpoint", "body"], { "status": "new", "endpoint": `hub/import-csv/${entity}` }, null, null, interactionModel))
    if (cursor.length > 0) {
        result.message = { default: "A previous import is pending", "fr_FR": "Un précédent import est en attente", level: "warning" }
        const interaction = cursor[0]
        result.properties = {
            jsonPayload: {
                type: "table", 
                labels: { default: "CSV content", fr_FR: "Contenu CSV" },
                value: JSON.parse(interaction.body).payload,
                options: { disabled: true }
            }
        }
        result.post.id = interaction.id
    }
    else {
        result.properties = { 
            template: { 
                type: "html",
                labels: { default: ".csv file template", fr_FR: "Modèle de fichier .csv" },
                value: "<a href=\"/client-cz/template/Connections.csv\">Connections.csv</a>",
                options: {}
            },
            csvFile: { 
                type: "file", 
                labels: { default: "Choose CSV File", fr_FR: "Choisir un fichier CSV" },
                options: { required: true }
            }
        }
    }
    
    return result
}

const postImportCsvAction = async ({ req }, context, db) => {
    const entity = assert.notEmpty(req.params, "entity")
    const interactionId = req.params.id
    const view = req.query.view

    let importConfig = context.config[`${entity}/import/${view}`]
    if (!importConfig) importConfig = context.config[`${entity}/import/default`]

    for (const [propertyId, property] of Object.entries(importConfig.properties)) {
        const propertyDef = context.config[`${entity}/property/${propertyId}`]
        if (propertyDef) property.labels = propertyDef.labels
    }

    for (const property of Object.values(importConfig.mapping)) {
        const propertyDef = context.config[`${entity}/property/${property.propertyId}`]
        importConfig.properties[property.propertyId] = propertyDef
        importConfig.properties[property.propertyId].update = true
    }

    const connection = await db.getConnection()

    const interactionModel = context.config["interaction/model"]

    if (interactionId == 0) {
        
        const sheet = req.file.buffer.toString("utf8").split("\n")

        const rows = []
        for (let i = 0; i < sheet.length; i++) {
            let row = sheet[i].split("\\").join("/").split("\t").join(""), corrected = []
            row = row.split("\"")
            for (let j = 0; j < row.length; j++) {
                const comp = (j % 2 == 1) ? row[j].split(",").join("") : row[j]
                corrected.push(comp)
            }
            row = corrected.join("").split(",")
            rows.push(row)
        }

        const start = (importConfig.headersRowNumber) ? importConfig.headersRowNumber : 0, end = sheet.length
        const headers = rows[start]
        const payload = []
        for (let i = start + 1; i < end; i++) {
            let row = rows[i], pairs = {}
            
            for (let j = 0; j < headers.length; j++) pairs[headers[j]] = row[j]
            payload.push(pairs)
        }

        const { valid, invalid } = match(payload, importConfig)

        /**
         * Store the content as interaction in DB
         */

        const interactionData = {
            "status": "new",
            "provider": "flow-er",
            "endpoint": `hub/import-csv/${entity}`,
            "method": "POST",
            "body": JSON.stringify({ payload: [], valid, invalid }),
            "authorization": "bearer",
            "status_code": "200"
        }
        const [insertedRow] = (await connection.execute(insert(context, "interaction", interactionData, interactionModel)))

        const result = {
            layout: {
                title: { default: "Import an XLSX file", fr_FR: "Importer un fichier XLSX" },
                formJwt: "To be defined",
                renderer: "renderGlobal"
            },
            properties: {
                jsonPayload: {
                    type: "table", 
                    labels: { default: "XLSX content", fr_FR: "Contenu XLSX" },
                    value: payload,
                    options: { disabled: true }
                }
            },
            post: {
                controller: "hub",
                action: "import-csv",
                entity: "crm_account",
                id: insertedRow.insertId,
                labels: { default: "import", fr_FR: "Importer" },
                renderer: "renderImportCsv"
            }
        }
    
        return result
    }

    /**
     * Read the previously loaded interaction
     */

    const [cursor] = await connection.execute(select(context, "interaction", ["status", "endpoint", "body"], { "id": interactionId }, null, null, interactionModel))
    if (cursor.length == 0) return JSON.stringify({ "status": "ko", "message": "Unknown interaction" })
    const interaction = cursor[0]
    if (interaction.endpoint != `hub/import-csv/${entity}`) return JSON.stringify({ "status": "ko", "message": "Not an import-csv interaction or entity not matching" })
    if (interaction.status != "new") return JSON.stringify({ "status": "ko", "message": "Already processed interaction" })

    const body = JSON.parse(interaction.body)
    const { valid, invalid } = body
    if (!valid || !invalid) return JSON.stringify({ "status": "ko", "message": "Invalid JSON data in interaction" })
    
    const targetModel = context.config[`${entity}/model`]
    const mergedPayload = await mergePayload(context, entity, targetModel, valid, importConfig, connection)

    /**
     * Find out the data to actually store in the database 
     */

    await connection.beginTransaction()

    let { rowsToStore, rowsToReject } = dataToStore(targetModel, mergedPayload)

    if (rowsToReject.length > 0) {
        return JSON.stringify({ "status": "ko", "errors": rowsToReject })
    }
    
    /**
     * Find out the entities to insert vs update in the database 
     */

    rowsToStore = entitiesToStore(entity, targetModel, rowsToStore)
    await storeEntities(context, entity, rowsToStore, targetModel, connection)
    await auditCells(context, rowsToStore, connection)

    await connection.execute(update(context, "interaction", [interactionId], { "status": "processed"}, interactionModel))

    await connection.commit()
    await connection.release()

    return JSON.stringify({ "status": "ok", "stored": rowsToStore })
}

module.exports = {
    getImportCsvAction,
    postImportCsvAction
}