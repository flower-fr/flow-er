const { assert } = require("../../../../core/api-utils")
const moment = require("moment")
const PDFDocument = require("pdfkit")
const { WritableBufferStream } = require("../../../utils/WritableBufferStream")
const { throwBadRequestError } = require("../../../../core/api-utils")

const { select } = require("../../../flCore/server/model/select")
const { insert } = require("../../../flCore/server/model/insert")
const { update } = require("../../../flCore/server/model/update")

const createPdf = async ({ entity, type, owner_entity, owner_id, payload }, context, db) => {
    const documentModel = context.config[`${ entity }/model`]
    const pdfTemplate = context.config[`${ entity }/pdf/${ type }`]

    const connection = await db.getConnection()
    await connection.beginTransaction()
    try {
        const data = payload.data, folder = payload.folder || "", name = payload.name || ""
        const documentData = {
            type,
            date: moment().format("YYYY-MM-DD"),
            owner_entity,
            owner_id,
            folder,
            name,
            mime: "application/pdf",
            data,
            template: pdfTemplate
        }
    
        // Increment the reference
        if (pdfTemplate.counter) {
            const counterModel = context.config[`${ pdfTemplate.counter }/model`]
            const counter = (await connection.execute(select(context, pdfTemplate.counter, ["id", "next_value"], { type }, null, null, counterModel)))[0][0]
            documentData.reference = counter.next_value
            await connection.execute(update(context, pdfTemplate.counter, [counter.id], { next_value: counter.next_value + 1 }, counterModel))
        }
    
        const [insertedRow] = (await connection.execute(insert(context, entity, documentData, documentModel)))
        const id = insertedRow.insertId

        // Generate PDF binary and store in DB as a base64 content
        const doc = new PDFDocument({
            size: pdfTemplate.size || "A4",
            margins: pdfTemplate.margins || { top: 0, bottom: 0, left: 0, right: 0 }
        })

        for (const page of pdfTemplate.pages) {

            const font = page.font || "Helvetica", fontSize = page.fontSize || 10.5

            for (const image of page.images) {
                doc.image(context.localize(image), image.x, image.y, {
                    fit: image.fit,
                    align: image.align || "center",
                    valign: image.valign || "center"
                })
            }

            for (const variable of page.variables) {

                const entity = variable.entity, row = variable.row || 0
                let value = ""
                if (variable.value) {
                    if (variable.value === "reference") {
                        value = documentData.reference
                    } else if (variable.value === "date") {
                        value = moment(documentData.date).format("DD/MM/YYYY")
                    } else {
                        if (data[entity].rows[row]) value = data[entity].rows[row][variable.value]
                    }
                } else {
                    const format = context.localize(variable).split("%s")
                    value = []
                    for (let i = 0; i < format.length; i++) {
                        value.push(format[i])
                        if (i != format.length -1) {
                            if (variable.params[i] === "reference") {
                                value.push(documentData.reference)
                            } else if (variable.params[i] === "date") {
                                value.push(moment(documentData.date).format("DD/MM/YYYY"))
                            } else {
                                if (data[entity].rows[row]) value.push(data[entity].rows[row][variable.params[i]])
                            }
                        }
                    }
                    value = value.join("")
                }

                let options = {}
                if (variable.displayRule === "capitalizedLetters") {
                    if (value) value = value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase()
                } else if (variable.displayRule === "date") {
                    value = moment(value).format("DD/MM/YYYY")
                } else if (variable.displayRule === "amount") {
                    if (value) {
                        const formatter = new Intl.NumberFormat("fr-FR", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        })
                        value = formatter.format(value).replace(/\s/i, " ")
                        options = { width: 50, align: "right" }
                    }
                } else if (variable.displayRule === "int") {
                    if (value) {
                        const formatter = new Intl.NumberFormat("fr-FR")
                        value = formatter.format(value)
                        options = { width: 50, align: "right" }
                    }
                }

                doc
                    .font(variable.font || font)
                    .fontSize(variable.fontSize || fontSize)
                    .text(value, variable.x, variable.y, options)
            }
        }

        connection.commit()
        connection.release()

        let writeStream = new WritableBufferStream()
        doc.pipe(writeStream)
        writeStream.on("finish", () => {
            const content = writeStream.toBuffer().toString("base64")
            db.execute(update(context, entity, [id], { content }, documentModel))
        })

        doc.end()

    } catch {
        await connection.rollback()
        connection.release()
        throw throwBadRequestError()
    }
}

module.exports = {
    createPdf
}