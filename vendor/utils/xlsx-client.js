const XLSX = require("xlsx-js-style")

const createXlsxClient = ({ config, logger }) => {
    return {
        xlsx: xlsx({ logger })
    }
}

const xlsx = ({ logger }) => async (worksheet, name) => {
    
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, name)
  
    /* create an XLSX file and try to save to Presidents.xlsx */
    XLSX.writeFile(workbook, "Test.xlsx")  

    logger && logger.debug("Xlsx generated")
}

module.exports = {
    createXlsxClient,
    xlsx
}