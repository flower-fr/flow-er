const excelJS = require("exceljs")
const { assert } = require("../../../../core/api-utils")

const { listAction } = require("./listAction")

const exportAction = async ({ req, res }, context, db) => 
{
    const entity = assert.notEmpty(req.params, "entity")
    const view = (req.query.view) ? req.query.view : "default"

    let exportConfig = context.config[`${entity}/export/${view}`]
    if (!exportConfig) exportConfig = context.config[`${entity}/export/default`]
    const data = await listAction({ req }, context, db, exportConfig)

    const workbook = new excelJS.Workbook()

    const worksheet = workbook.addWorksheet(entity)
    const columns = []
    for (const propertyId of Object.keys(data.rows[0])) {
        const property = data.properties[propertyId]
        columns.push({ header: (property) ? context.localize(property.labels) : propertyId, key: propertyId, width: 20 })
    }
    worksheet.columns = columns
    data.rows.forEach(row => { 
        const values = {}
        for (const [key, value] of Object.entries(row)) {
            const property = data.properties[key]
            if (property && property.type === "select") values[key] = context.localize(property.modalities[value])
            else values[key] = value
        }
        worksheet.addRow(values) 
    })

    worksheet.eachRow(function (row, rowNumber) {
        row.eachCell((cell, colNumber) => {
            if (rowNumber == 1) {
                // First set the background of header row
                cell.fill = {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: { argb: "387D3D" }
                }
            }
        })
    })

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"); res.setHeader("Content-Disposition", "attachment; filename=" + "users.xlsx")
    await workbook.xlsx.write(res)
}

module.exports = {
    exportAction
}