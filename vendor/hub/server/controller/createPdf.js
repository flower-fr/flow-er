const { assert } = require("../../../../core/api-utils")
const util = require("util")

const moment = require("moment")
const PDFDocument = require("pdfkit")
const { WritableBufferStream } = require("../../../utils/WritableBufferStream")
const { throwBadRequestError } = require("../../../../core/api-utils")

const { select } = require("../../../flCore/server/model/select")
const { insert } = require("../../../flCore/server/model/insert")
const { update } = require("../../../flCore/server/model/update")

const createPdf = async ({ entity, type, reference, owner_entity, owner_id, owner_document_id, folder, name, data, template }, context, db, logger) => {
    const documentModel = context.config[`${ entity }/model`]
    const pageNumber = 1

    const connection = await db.getConnection()
    await connection.beginTransaction()
    try {
        const documentData = {
            type,
            date: moment().format("YYYY-MM-DD"),
            owner_entity,
            owner_id,
            folder,
            name,
            mime: "application/pdf",
            data,
            template
        }
    
        // Increment the reference
        documentData.reference = reference || ""
    
        const [insertedRow] = (await connection.execute(insert(context, entity, documentData, documentModel)))
        const id = insertedRow.insertId

        // Save the document id in the owner entity
        if (owner_document_id) {
            const ownerData = {}
            ownerData[owner_document_id] = id
            await connection.execute(update(context, owner_entity, [owner_id], ownerData, context.config[`${ owner_entity }/model`]))
        }

        // Generate PDF binary and store in DB as a base64 content
        const doc = new PDFDocument({
            size: template.size || "A4",
            margins: template.margins || { top: 0, bottom: 0, left: 0, right: 0 }
        })

        for (const page of Object.values(template.pages)) {

            const font = page.font || "Helvetica", fontSize = page.fontSize || 10.5

            logger && logger.debug(`fontSize: ${ fontSize }`)

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
                    if (variable.value === "date") {
                        value = moment(documentData.date).format("DD/MM/YYYY")
                    } else if (variable.value === "year") {
                        value = moment(documentData.date).format("YYYY")
                    } else if (variable.value === "pageNumber") {
                        value = pageNumber
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
                            } else if (variable.params[i] === "year") {
                                value.push(moment(documentData.date).format("YYYY"))
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

                if (variable.labels) value = `${ context.localize(variable.labels) }${ value }`

                doc
                    .font(variable.font || font)
                    .fontSize(variable.fontSize || fontSize)
                    .text(value, variable.x, variable.y, options)
            }

            let y
            for (const block of page.blocks || []) {
                let entity = block.entity
                if (block.y0) y = block.y0
                for (const row of data[entity].rows) {

                    logger && logger.debug(`row (${ entity }): ${ util.inspect(row, { color: true, depth: null }) }`)

                    for (const paragraph of block.paragraphs) {
                        if (paragraph.before) y += paragraph.before
                        if (paragraph.variables) {
                            for (const variable of paragraph.variables) {
                                if (variable.dy) y += variable.dy
                                let value = ""
                                if (variable.value) {
                                    if (variable.value === "reference") {
                                        value = documentData.reference
                                    } else if (variable.value === "date") {
                                        value = moment(documentData.date).format("DD/MM/YYYY")
                                    } else if (variable.value === "pageNumber") {
                                        value = pageNumber
                                    } else {
                                        value = row[variable.value]
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
                                                value.push(row[variable.params[i]])
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
                
                                if (variable.labels) {

                                    logger && logger.debug(`variable.labels: ${ util.inspect(variable.labels, { color: true, depth: null }) }`)

                                    value = `${ context.localize(variable.labels) }${ value }`
                                }

                                doc
                                    .font(variable.font || font)
                                    .fontSize(variable.fontSize || fontSize)
                                    .text(value, variable.x, y, options)
                            }
                            y += paragraph.rowHeight    
                        }
                            
                        if (paragraph.text) {

                            let value = paragraph.text.value ? row[paragraph.text.value] : context.localize(paragraph.text)

                            if (value && value !== "") {
                                value = value.split("\n")
                                for (const line of value) {
                                    doc
                                        .font(paragraph.font || font)
                                        .fontSize(paragraph.fontSize || fontSize)
                                        .text(line, paragraph.x, y)
                                    y += paragraph.rowHeight    
                                }
                            }
                        }
                    }

                    logger && logger.debug(`separator: ${ util.inspect(block.separator, { color: true, depth: null }) }`)

                    if (block.separator) {
                        doc
                            .lineWidth(.25)
                            .moveTo(block.separator.xMin, y)
                            .lineTo(block.separator.xMax, y)
                            .stroke()
                    }
                }
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