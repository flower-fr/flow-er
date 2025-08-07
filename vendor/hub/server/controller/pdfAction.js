const { assert } = require("../../../../core/api-utils")
const PDFDocument = require("pdfkit")
const { WritableBufferStream } = require("../../../utils/WritableBufferStream")

const { select } = require("../../../flCore/server/model/select")
const { update } = require("../../../flCore/server/model/update")

const getPdfAction = async ({ req, res, logger }, context, connection) => {
    const entity = assert.notEmpty(req.params, "entity")
    const id = assert.notEmpty(req.params, "id")
    const pdfModel = context.config[`${ entity }/model`]

    const row = (await connection.execute(select(context, entity, ["name", "content"], { id }, null, null, pdfModel)))[0][0]
    res.set("Content-type", "application/pdf")
    res.set("Content-disposition", `attachment; filename="${ row.name }"`)
    return Buffer.from(row.content, "base64")
}

const createPdf = async ({ entity, id, view, payload }, context, connection) => {
    const pdfModel = context.config[`${ entity }/model`]
    const pdfTemplate = context.config[`${ entity }/pdf/${ view }`]

    // Create a document
    const doc = new PDFDocument({
        size: pdfTemplate.size || "A4",
        margins: pdfTemplate.margins || { top: 0, bottom: 0, left: 0, right: 0 }
    })

    for (const page of pdfTemplate.pages) {

        const font = page.font || "Helvetica", fontSize = page.fontSize || 10.5

        for (const image of page.images) {
            console.log(image)
            doc.image(context.localize(image), image.x, image.y, {
                fit: image.fit,
                align: image.align || "center",
                valign: image.valign || "center"
            })
        }

        for (const variable of page.variables) {
            console.log(variable)
            let value
            if (variable.value) {
                value = payload[variable.value]
            } else {
                const format = variable.format.split("%s")
                value = []
                for (let i = 0; i < format.length; i++) {
                    value.push(format[i])
                    if (i != format.length -1) value.push(payload[variable.params[i]])
                }
                value = value.join("")
            }
            if (variable.displayRule === "capitalizedLetters") {
                value = value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase()
            }
            doc
                .font(variable.font || font)
                .fontSize(variable.fontSize || fontSize)
                .text(value, variable.x, variable.y)
        }
    }

    let writeStream = new WritableBufferStream()
    doc.pipe(writeStream)
    writeStream.on("finish", () => {
        const content = writeStream.toBuffer().toString("base64")
        connection.execute(update(context, entity, [id], { content }, pdfModel))
    })

    doc.end()
}

const postPdfAction = async ({ req, res, logger }, context, connection) => {
    const entity = assert.notEmpty(req.params, "entity")
    const id = assert.notEmpty(req.params, "id")
    const view = req.query.view || "default"
    const payload = req.body
    createPdf({ entity, id, view, payload }, context, connection)
}

module.exports = {
    getPdfAction, postPdfAction
}