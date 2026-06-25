const {
    Document,
    Paragraph,
    TextRun,
    Packer,
    HeadingLevel,
    Table,
    TableRow,
    TableCell,
    WidthType,
    PageBreak,
    Numbering,
    LevelFormat,
    AlignmentType,
} = require("docx")

const util = require("util")

function mdTextToDocx(text)
{
    // Expression régulière pour matcher les éléments Markdown
    const markdownRegex = /(\*\*.*?\*\*|\*.*?\*|`.*?`|\[.*?\]\(.*?\))/g
    const parts = []

    // Découper le texte en parties (markdown et texte normal)
    let lastIndex = 0
    let match

    while ((match = markdownRegex.exec(text)) !== null) {
    // Ajouter le texte normal avant le match
        if (match.index > lastIndex) {
            parts.push({
                text: text.slice(lastIndex, match.index),
            })
        }

        // Traiter le match Markdown
        const matchedText = match[0]

        // Cas 1 : **texte** (gras)
        if (matchedText.startsWith("**") && matchedText.endsWith("**")) {
            parts.push({
                text: matchedText.slice(2, -2),
                bold: true,
            })
        }
        // Cas 2 : *texte* (italique)
        else if (matchedText.startsWith("*") && matchedText.endsWith("*")) {
            parts.push({
                text: matchedText.slice(1, -1),
                italics: true,
            })
        }
        // Cas 3 : [texte](url) (lien)
        else if (matchedText.includes("](")) {
            const linkMatch = matchedText.match(/\[(.*?)\]\((.*?)\)/)
            if (linkMatch) {
                parts.push({
                    text: linkMatch[1],
                    link: linkMatch[2],
                    color: "0000FF", // Bleu
                    underline: {
                        type: "single",
                    },
                })
            }
        }
        // Cas 4 : `texte` (code)
        else if (matchedText.startsWith("`") && matchedText.endsWith("`")) {
            parts.push({
                text: matchedText.slice(1, -1),
                font: "Courier New",
                background: "F5F5F5", // Fond gris clair
            })
        }

        lastIndex = match.index + matchedText.length
    }

    // Ajouter le texte restant après le dernier match
    if (lastIndex < text.length) {
        parts.push({
            text: text.slice(lastIndex),
        })
    }

    // Filtrer les parties vides (si nécessaire)
    return parts.filter(part => part.text !== "")
}

const mdToDocx = (content) => {
    const lines = content.split("\n")
    const result = []
    let inCodeBlock = false
    let inTable = false
    let tableRows = []
    let tableHeaders
    let isHeaderRow
    let currentListType = null // 'bullet' ou 'number'
    let currentListLevel = 0
    let listItems = []

    // Fonction pour ajouter un paragraphe ou un titre
    const addParagraphOrTitle = (text, level = null) => {
        if (!text.trim()) return

        const formattedText = mdTextToDocx(text.trim())

        if (level === 1) {
            result.push({
                type: "heading1",
                children: formattedText,
            })
        } else if (level === 2) {
            result.push({
                type: "heading2",
                children: formattedText,
            })
        } else if (level === 3) {
            result.push({
                type: "heading3",
                children: formattedText,
            })
        } else {
            result.push({
                type: "paragraph",
                children: formattedText,
            })
        }
    }

    // Fonction pour ajouter une liste
    const addList = () => {
        if (listItems.length > 0) {
            result.push({
                type: "list",
                listType: currentListType,
                level: currentListLevel,
                children: listItems,
            })
            listItems = []
        }
    }

    // Fonction pour ajouter un tableau
    const addTable = () => {
        if (tableRows.length > 0) {
            result.push({
                type: "table",
                headers: tableHeaders,
                rows: tableRows,
            })
            tableHeaders = []
            tableRows = []
        }
    }

    // Fonction pour ajouter une image
    const addImage = (alt, url) => {
        result.push({
            type: "image",
            alt: alt,
            url: url,
        })
    }

    // Fonction pour ajouter un bloc de code
    const addCodeBlock = (code) => {
        result.push({
            type: "code",
            text: code,
        })
    }

    // Parcourir chaque ligne
    for (const line of lines) {

        // Liste à puces ou numérotée
        const bulletMatch = line.match(/^(\s*)([*\-+]|\d+\.)\s+(.*?)$/)
        if (bulletMatch) {
            const [, indent, marker, text] = bulletMatch
            const level = indent.length / 2 // Supposons 2 espaces par niveau
            const isNumbered = /\d+\./.test(marker)

            // Si on change de type de liste ou de niveau, finaliser la liste en cours
            if (
                currentListType !== (isNumbered ? "number" : "bullet") || currentListLevel !== level
            ) {
                addList()
                currentListType = isNumbered ? "number" : "bullet"
                currentListLevel = level
            }

            listItems.push(text)
            continue
        } else {
            // Si on était dans une liste, la finaliser
            if (currentListType) {
                addList()
                currentListType = null
                currentListLevel = 0
            }
        }

        const trimmedLine = line.trim()

        // Ignorer les lignes vides
        if (!trimmedLine) continue

        // Séparateur de page
        if (trimmedLine === "---") {
            addList() // Finaliser la liste en cours
            addTable() // Finaliser le tableau en cours
            result.push({
                type: "pageBreak",
            })
            continue
        }

        // Bloc de code
        if (trimmedLine.startsWith("```")) {
            if (inCodeBlock) {
                // Fin du bloc de code
                inCodeBlock = false
            } else {
                // Début du bloc de code
                inCodeBlock = true
                let code = ""
                // Trouver la fin du bloc de code
                const codeStartIndex = lines.indexOf(line) + 1
                for (let i = codeStartIndex; i < lines.length; i++) {
                    if (lines[i].trim().startsWith("```")) {
                        break
                    }
                    code += lines[i] + "\n"
                }
                addCodeBlock(code.trim())
            }
            continue
        }

        // Tableau
        if (trimmedLine.startsWith("|")) {
            if (!inTable) {
                inTable = true
                tableRows = []
                tableHeaders = []
                isHeaderRow = true

            }

            // Vérifier si c'est une ligne de séparation (ex: |---|---|)
            const isSeparatorRow = /^\|?\s*:?-+:?\s*(\|:?-+:?\s*)*\|?$/.test(trimmedLine)

            if (isSeparatorRow) {
                isHeaderRow = false
                continue
            }

            // Parser la ligne du tableau
            const row = trimmedLine.split("|").slice(1, -1).map(cell => cell.trim())
        

            if (isHeaderRow) {
                tableHeaders = row // Stocker les en-têtes
            } else {
                tableRows.push(row) // Stocker les lignes normales
            }
            continue

        } else if (inTable) {
            // Fin du tableau
            inTable = false
            addTable()
        }

        // Image
        const imageMatch = trimmedLine.match(/^!$$(.*?)$$$(.*?)$/)
        if (imageMatch) {
            addList() // Finaliser la liste en cours
            addImage(imageMatch[1], imageMatch[2])
            continue
        }

        // Titre 1
        if (trimmedLine.startsWith("# ")) {
            addList() // Finaliser la liste en cours
            addTable() // Finaliser le tableau en cours
            addParagraphOrTitle(trimmedLine.slice(2), 1)
            continue
        }

        // Titre 2
        if (trimmedLine.startsWith("## ")) {
            addList() // Finaliser la liste en cours
            addTable() // Finaliser le tableau en cours
            addParagraphOrTitle(trimmedLine.slice(3), 2)
            continue
        }

        // Titre 3
        if (trimmedLine.startsWith("### ")) {
            addList() // Finaliser la liste en cours
            addTable() // Finaliser le tableau en cours
            addParagraphOrTitle(trimmedLine.slice(4), 3)
            continue
        }

        // Paragraphe normal
        addTable() // Finaliser le tableau en cours
        addParagraphOrTitle(trimmedLine)
    }

    // Finaliser les éléments en cours à la fin du document
    addList()
    addTable()

    return result
}

module.exports = {
    mdTextToDocx,
    mdToDocx
}

async function generateDocx(jsonStructure)
{
    const children = []
    let rows, headerRow

    for (const item of jsonStructure) {
        switch (item.type) {
        case "pageBreak":
            children.push(new PageBreak())
            break

        case "heading1":
            children.push(
                new Paragraph({
                    heading: HeadingLevel.HEADING_1,
                    children: item.children.map(child => new TextRun(child)),
                })
            )
            break

        case "heading2":
            children.push(
                new Paragraph({
                    heading: HeadingLevel.HEADING_2,
                    children: item.children.map(child => new TextRun(child)),
                })
            )
            break

        case "heading3":
            children.push(
                new Paragraph({
                    text: item.children[0].text,
                    heading: HeadingLevel.HEADING_3,
                    children: item.children.map(child => new TextRun(child)),
                })
            )
            break

        case "paragraph":
            children.push(
                new Paragraph({
                    children: item.children.map(child => new TextRun(child)),
                })
            )
            break

        case "list":
            for (const text of item.children) {
                if (item.listType === "number") {
                    children.push(new Paragraph({
                        text: text,
                        bullet: {
                            level: item.level,
                        },
                        numbering: {
                            reference: "myNumbering",
                            level: item.level,
                        }
                    }))
                } else {
                    children.push(new Paragraph({
                        text: text,
                        bullet: {
                            level: item.level,
                        },
                        bullet: {
                            level: item.level,
                        }
                    }))
                }
            }
            break

        case "table":
            rows = []
            // Ajouter l'en-tête
            headerRow = new TableRow({
                children: item.headers.map(headerText =>
                    new TableCell({
                        children: [
                            new Paragraph({
                                text: headerText,
                                bold: true,
                            }),
                        ],
                        width: { size: 20, type: WidthType.PERCENTAGE },
                    })
                ),
            })
            rows.push(headerRow)
            
            item.rows.forEach(
                row => {
                    rows.push(new TableRow({
                        children: row.map(
                            cell => new TableCell({
                                children: [new Paragraph(cell)],
                                width: { size: 20, type: WidthType.PERCENTAGE },
                            })
                        ),
                    }))
                }
            )
            children.push(new Table({
                rows: rows,
            }))
            break

        case "image":
            children.push(
                new Paragraph({
                    children: [
                        new ImageRun({
                            data: Buffer.from(/* Récupérer l'image via l'URL */),
                            transformation: {
                                width: 200,
                                height: 200,
                            },
                        }),
                    ],
                })
            )
            break

        case "code":
            children.push(
                new Paragraph({
                    children: [
                        new TextRun({
                            text: item.text,
                            font: "Courier New",
                            background: "F5F5F5",
                        }),
                    ],
                })
            )
            break
        }
    }

    const doc = new Document({
        numbering: {
            config: [
                {
                    reference: "myNumbering",
                    levels: [
                        {
                            level: 0,
                            format: LevelFormat.DECIMAL,
                            text: "%1.",
                            alignment: AlignmentType.LEFT,
                            start: 1,
                            style: {
                                paragraph: {
                                    indent: { left: 720, hanging: 360 },
                                },
                            },
                        },
                        {
                            level: 1,
                            format: LevelFormat.LOWER_LETTER,
                            text: "%2)",
                            alignment: AlignmentType.LEFT,
                            style: {
                                paragraph: {
                                    indent: { left: 1440, hanging: 360 },
                                },
                            },
                        },
                    ],
                },
            ],
        },
        sections: [{
            children: children,
        }],
    })

    return Packer.toBuffer(doc)
}

/**
 * Unit test
 */

const test = `
# Titre 1

Ceci est un paragraphe normal avec du **texte en gras** et un [lien](https://example.com).

## Titre 2

- Élément 1
- Élément 2
  - Sous-élément 1
  - Sous-élément 2

1. Premier élément
2. Deuxième élément
 | Colonne 1 | Colonne 2 |
 |-----------|-----------|
 | Ligne 1   | Ligne 1   |
 | Ligne 2   | Ligne 2   |

![Image](https://example.com/image.png)
`

console.log(util.inspect(mdToDocx(test), { depth: null, colors: true }))

const markdownContent = `# Titre 1

Ceci est un paragraphe normal avec du **texte en gras** et un [lien](https://example.com).`

const jsonStructure = mdToDocx(test)
generateDocx(jsonStructure).then(buffer => {
    require("fs").writeFileSync("document.docx", buffer)
    console.log("Fichier généré : document.docx")
})
