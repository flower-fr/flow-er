const util = require("util")
const { assert, throwBadRequestError } = require("../../../../core/api-utils")

const xlsxParser = require("node-xlsx").default
const moment = require("moment")
const { select } = require("../../../flCore/server/model/select")
const { insert } = require("../../../flCore/server/model/insert")
const { update } = require("../../../flCore/server/model/update")
const { mergePayload } = require("../../../flCore/server/post/save")
const { dataToStore } = require("../../../flCore/server/model/dataToStore")
const { entitiesToStore } = require("../../../flCore/server/model/entitiesToStore")
const { storeEntities } = require("../../../flCore/server/post/storeEntities")
const { auditCells } = require("../../../flCore/server/post/auditCells")

/**
 * Convert the formData file to JSON
 */

const parse = (sheet) => {
    let header = false
    const payload = []
    for (let row of sheet) {
        if (!header) {
            if (!row[0] || row[0] === "" || row[0] === "Tableau 1") continue
            header = []
            for (let i = 0; i < row.length; i++) {
                header[i] = (typeof(row[i]) == "string") ? row[i].split("\r").join("").split("\n").join("").split("\"").join("\\\"") : row[i]
            }
            continue
        }
        const resRow = {}
        for (let i = 0; i < row.length; i++) {
            const value = (row[i]) ? row[i] : null
            resRow[header[i]] = (typeof(value) == "string") ? value.split("\r").join("").split("\n").join("").split("\"").join("\\\"") : value
        }
        if (Object.values(resRow).length > 0) payload.push(resRow)
    }
    return payload
}

/**
 * Map the payload to the model
 */

const match = (payload, importConfig, { valid, invalid }) => {

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
                .split("\n").join("")
                .split("-").join("")
                .split("_").join("")
                .split("/").join("")
                .split(":").join("")
                .split("\n").join("")
                .toLowerCase()
                .normalize("NFD").replace(/[\u0300-\u036f]/g, "")

            
            // Matching key
            if (importConfig.mapping[key]) {
                const matched = importConfig.mapping[key]
                if (!validRow[matched["propertyId"]]) {
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
                            value = new Date(value)
                            validRow[matched["propertyId"]] = moment(value).format("YYYY-MM-DD")
                        }
                        else validRow[matched["propertyId"]] = value
                    }
                    else if (matched.type == "text") {
                        if (Number.isInteger(value)) value = value.toString()
                        validRow[matched["propertyId"]] = value
                    }
                    else validRow[matched["propertyId"]] = value    
                }
            }

            // Unmatching key
            else {
                invalidRow[key] = value
            }
        }
        valid.push(validRow)
        invalid.push(invalidRow)
    }
}

/**
 * Import xlsx files
 */

const getImportXlsxAction = async ({ req }, context, db) => {
    const entity = assert.notEmpty(req.params, "entity")
    const view = (req.query.view) ? req.query.view : "default"

    let importConfig = context.config[`${entity}/import/${view}`]
    if (!importConfig) importConfig = context.config[`${entity}/import/default`]

    const result = {
        layout: {
            title: { default: "Import an XLSX file", fr_FR: "Importer un fichier XLSX" },
            formJwt: "To be defined",
            renderer: "renderGlobal"
        },
        post: {
            controller: "hub",
            action: "import-xlsx",
            entity: entity,
            id: 0,
            view,
            labels: { default: "import", fr_FR: "Importer" }
        }
    }

    const connection = await db.getConnection()

    const interactionModel = context.config["interaction/model"]
    const [cursor] = await connection.execute(select(context, "interaction", ["id", "status", "endpoint", "body"], { "status": "new", "endpoint": `hub/import-xlsx/${entity}` }, null, null, interactionModel))
    if (cursor.length > 0) {
        result.message = { default: "A previous import is pending", "fr_FR": "Un précédent import est en attente", level: "warning" }
        const interaction = cursor[0]
        result.properties = {
            jsonPayload: {
                type: "table", 
                labels: { default: "XLSX content", fr_FR: "Contenu XLSX" },
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
                labels: { default: ".xlsx file template", fr_FR: "Modèle de fichier .xlsx" },
                value: `<a href="/${ context.instance.caption }/template/${ importConfig.template }">${ importConfig.template }</a>`,
                options: {}
            },
            xlsxFile: { 
                type: "file", 
                labels: { default: "Choose XLSX File", fr_FR: "Choisir un fichier XLSX" },
                options: { required: true }
            }
        }
    }
    
    return result
}

const postImportXlsxAction = async ({ req }, context, db) => {
    const entity = assert.notEmpty(req.params, "entity")
    const interactionId = req.params.id
    const view = (req.query.view) ? req.query.view : "default"

    let importConfig = context.config[`${entity}/import/${view}`]
    if (!importConfig) importConfig = context.config[`${entity}/import/default`]
    
    for (const [propertyId, property] of Object.entries(importConfig.properties)) {
        const propertyDef = context.config[`${entity}/property/${propertyId}`]
        if (propertyDef) property.labels = propertyDef.labels
    }

    for (const property of Object.values(importConfig.mapping)) {
        const propertyDef = context.config[`${entity}/property/${property.propertyId}`]
        if (propertyDef) {
            importConfig.properties[property.propertyId] = propertyDef
            importConfig.properties[property.propertyId].update = true    
        }
    }

    const connection = await db.getConnection()
    try {
        const interactionModel = context.config["interaction/model"]

        if (interactionId == 0) {

            // Convert the formData file to JSON
            
            const workSheetsFromStream = xlsxParser.parse(req.file.buffer, { cellDates: true })
            let payload = [], valid = [], invalid = [] 
            for (const sheet of workSheetsFromStream) {
                const p = parse(sheet.data)
                match(p, importConfig, { valid, invalid })
                payload = payload.concat(p)
            }

            /**
             * Store the content as interaction in DB
             */

            const interactionData = {
                "status": "new",
                "provider": "flow-er",
                "endpoint": `hub/import-xlsx/${entity}`,
                "method": "POST",
                "body": JSON.stringify({ payload, valid, invalid }),
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
                    action: "import-xlsx",
                    entity: entity,
                    id: insertedRow.insertId,
                    view,
                    labels: { default: "import", fr_FR: "Importer" }
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
        if (interaction.endpoint != `hub/import-xlsx/${entity}`) return JSON.stringify({ "status": "ko", "message": "Not an import-xlsx interaction or entity not matching" })
        if (interaction.status != "new") return JSON.stringify({ "status": "ko", "message": "Already processed interaction" })

        const body = JSON.parse(interaction.body)
        const { payload, valid, invalid } = body
        if (!payload || !valid || !invalid) return JSON.stringify({ "status": "ko", "message": "Invalid JSON data in interaction" })
        
        const targetModel = context.config[`${entity}/model`]
        const mergedPayload = await mergePayload(context, entity, targetModel, valid, importConfig, connection)

        /**
         * Find out the data to actually store in the database 
         */

        await connection.beginTransaction()

        let { rowsToStore, rowsToReject } = dataToStore(targetModel, mergedPayload)
        // if (rowsToReject.length > 0) {
        //     return JSON.stringify({ "status": "ko", "errors": rowsToReject })
        // }
        
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
    catch {
        await connection.rollback()
        await connection.release()
        return JSON.stringify({ "status": "ko", "errors": "Bad request" })
    }
}

module.exports = {
    getImportXlsxAction,
    postImportXlsxAction
}