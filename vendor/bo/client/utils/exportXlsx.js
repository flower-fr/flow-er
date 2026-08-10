import ExcelJS from "/js/exceljs.esm.js"


const HEADER_FILL_COLOR = "387D3D"
const XLSX_MIME_TYPE = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"


/**
 * Build and download an XLSX file entirely in the browser,
 * from an export config and the rows to export.
 *
 * @param {string} fileName - Name of the file to download
 * @param {Object} config - Export config.
 * @param {Array} rows - Rows to export.
 * @returns {Promise<void>} Resolves once the browser download has been triggered.
 */
const exportXlsx = async (fileName, config, rows) => {
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet("export")

    const propertyEntries = Object.entries(config.properties)
    worksheet.columns = propertyEntries.map(([key, definition]) => ({
        header: definition.header,
        key,
        width: 20,
    }))

    rows.forEach(row => worksheet.addRow(buildRowValues(row, propertyEntries)))

    applyHeaderStyle(worksheet)

    const buffer = await workbook.xlsx.writeBuffer()
    triggerDownload(buffer, fileName)
}

/**
 * Resolve a worksheet row's cell values from a source row and the export property definitions.
 * @param {Object} row
 * @param {Array<[string, { value?: string, property?: string }]>} propertyEntries
 * @returns {Object}
 */
const buildRowValues = (row, propertyEntries) => {
    const values = {}
    for (const [key, definition] of propertyEntries) {
        values[key] = Object.hasOwn(definition, "value") ? definition.value : row[definition.property]
    }
    return values
}

/**
 * Apply the header row background.
 * @param {import("exceljs").Worksheet} worksheet
 */
const applyHeaderStyle = worksheet => {
    worksheet.getRow(1).eachCell(cell => {
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: HEADER_FILL_COLOR } }
    })
}

/**
 * Trigger a browser download for a binary buffer, then release the temporary object URL.
 * @param {ArrayBuffer} buffer
 * @param {string} fileName
 */
const triggerDownload = (buffer, fileName) => {
    const blob = new Blob([buffer], { type: XLSX_MIME_TYPE })
    const url = URL.createObjectURL(blob)

    const link = document.createElement("a")
    link.href = url
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    link.remove()

    URL.revokeObjectURL(url)
}

export default exportXlsx