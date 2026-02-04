/**
 * Check for integrity of the given data to store (either insert or update which is determined later)
 */
const dataToStore = (model, rows) => {

    const rowsToStore = [], rowsToReject = []

    for (const row of rows) {
        const cellsToStore = {}, cellsToReject = {}
        for (let propertyId of Object.keys(row)) {
            if (propertyId != "formJwt") {
                const property = model.properties[propertyId]
                if (property) { //cellsToReject[propertyId] = "unknown"
                // else {
                    let value = row[propertyId]
                    if (property.type == "int") {
                        if (value == "") cellsToStore[propertyId] = 0
                        else if (Number.isNaN(value)) cellsToReject[propertyId] = "type"
                        else cellsToStore[propertyId] = parseInt(value)
                    }
                    else if (property.type == "decimal") {
                        if (Number.isNaN(value)) cellsToReject[propertyId] = "type"
                        else cellsToStore[propertyId] = parseFloat(value)
                    }
                    else cellsToStore[propertyId] = value    
                }    
            }
        }    
        rowsToStore.push(cellsToStore)
        if (Object.keys(cellsToReject).length !== 0) rowsToReject.push(cellsToReject)
    }

    return { "rowsToStore": rowsToStore, "rowsToReject": rowsToReject }
}

module.exports = {
    dataToStore
}