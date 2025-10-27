const excelJS = require("exceljs")
const { assert } = require("../../../../core/api-utils")

const { listAction } = require("./listAction")

const exportAction = async ({ req, res }, context, sql) => 
{
    const entity = assert.notEmpty(req.params, "entity")
    const view = (req.query.view) ? req.query.view : "default"

    let exportConfig = context.config[`${entity}/export/${view}`]
    if (!exportConfig) exportConfig = context.config[`${entity}/export/default`]
    const rawData = await listAction({ req }, context, sql, exportConfig)

    let data = {}
    for (const row of rawData.rows) {
        if (exportConfig.aggregation) {
            if (!data[row[exportConfig.aggregation.key]]) {
                data[row[exportConfig.aggregation.key]] = {}
                for (const [key, value] of Object.entries(row)) {
                    if (exportConfig.aggregation.sum.includes(key)) {
                        data[row[exportConfig.aggregation.key]][key] = 0    
                    } else {
                        data[row[exportConfig.aggregation.key]][key] = value
                    }
                }
            }
            for (const [key, value] of Object.entries(row)) {
                if (exportConfig.aggregation.sum.includes(key)) {
                    data[row[exportConfig.aggregation.key]][key] += parseFloat(value)
                }
            }
        }
        else data[row.id] = row
    }
    data = Object.values(data)

    const workbook = new excelJS.Workbook()

    const worksheet = workbook.addWorksheet(entity)
    const columns = []
    for (const propertyId of Object.keys(data[0])) {
        const property = rawData.properties[propertyId]
        columns.push({ header: (property) ? context.localize(property.labels) : propertyId, key: propertyId, width: 20 })
    }
    worksheet.columns = columns
    data.forEach(row => { 
        const values = {}
        for (const [key, value] of Object.entries(row)) {
            const property = rawData.properties[key]
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

    const fileName = exportConfig.fileName || "doubled-cream.xlsx"
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"); res.setHeader("Content-Disposition", `attachment; filename=${fileName}`)
    await workbook.xlsx.write(res)
}

module.exports = {
    exportAction
}