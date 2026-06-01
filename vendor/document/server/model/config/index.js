const { Document } = require("./Document")
const document = new(Document)
document.serialize("../../../config")

const { DocumentCell } = require("./DocumentCell")
const documentCell = new(DocumentCell)
documentCell.serialize("../../../config")
