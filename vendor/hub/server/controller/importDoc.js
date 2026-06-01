const fs = require("fs")
// const pdf = require("pdf-parse")
const mammoth = require("mammoth")
// const { JSDOM } = require("jsdom")
// const { DOMParser } = require("@xmldom/xmldom")

const { PDFDocument } = require("pdf-lib")
const PdfReader = require("pdfreader").PdfReader

function extractTextFromPDF(filePath) {
    return new Promise((resolve, reject) => {
        const text = []
        new PdfReader().parseFileItems(filePath, (err, item) => {
            if (err) reject(err)
            else if (!item) resolve(text.join(" ")) // Fin du fichier
            else if (item.text) text.push(item.text)
        })
    })
}

// async function extractTextFromPDF(filePath) {
//     const pdfBytes = fs.readFileSync(filePath)
//     const pdfDoc = await PDFDocument.load(pdfBytes)
//     const pages = pdfDoc.getPages()
//     let text = ""
//     for (const page of pages) {
// console.log(page)
//         text += await page.getText()
//     }
//     return text
// }

// // Fonction pour extraire le texte d'un PDF
// async function extractTextFromPDF(filePath) {
//     const dataBuffer = fs.readFileSync(filePath)
//     const data = await pdf(dataBuffer)
//     return data.text
// }

// Fonction pour extraire le texte d'un DOCX
async function extractTextFromDOCX(filePath) {
    const buffer = fs.readFileSync(filePath)
    const result = await mammoth.extractRawText({ buffer })
    return result.value
}

// Fonction générique pour traiter un fichier (PDF ou DOCX)
async function extractText(filePath) {
    if (filePath.endsWith(".pdf")) {
        return await extractTextFromPDF(filePath)
    } else if (filePath.endsWith(".docx")) {
        return await extractTextFromDOCX(filePath)
    } else {
        throw new Error("Format non supporté. Utilisez .pdf ou .docx")
    }
}

module.exports = extractText