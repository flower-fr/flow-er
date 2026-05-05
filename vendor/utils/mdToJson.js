const renderText = (text) => {
    // Simple markdown to HTML conversion
    let rendered = text
    rendered = rendered.replaceAll("<", "&lt;").replaceAll(">", "&gt;")
    rendered = rendered.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // bold
    rendered = rendered.replace(/\*(.*?)\*/g, "<em>$1</em>") // italic
    rendered = rendered.replace(/\[(.*?)\]\((.*?)\)/g, "<a type=\"button\" href=\"$2\" class=\"btn btn-light btn-rounded btn-lg me-1\" data-mdb-ripple-init>$1</a>") // links
    rendered = rendered.replace(/`(.*?)`/g, "<code>$1</code>") // inline code
    return rendered
}

const mdToJson = (content, markups) =>
{
    const pages = []
    let currentPage = { title: "" }, sections = [], currentText = [], currentCode, isCode = false, currentList = false, currentTable = false, currentImage = false
    for (const line of content.split("\n")) {
        if (line === "---") {
            if (currentList) {
                currentList = false
                currentText.push("</ul>")
            }
            if (currentTable) {
                currentTable = false
                currentText.push("</tbody></table>")
            }
            const section = { text: currentText }
            if (currentImage) {
                section.image = currentImage
            }
            sections.push(section)
            currentImage = false
            currentPage.sections = [...sections]
            sections = []

            currentText = []
            pages.push(currentPage)
            currentPage = { title: "" }

        } else if (line.startsWith("# ") && !markups?.h1) {
            currentPage.title = `${ renderText(line.replace("# ", "")) }`

        } else if (line.trim().startsWith("* ")) {
            if (!currentList) {
                currentList = true
                currentText.push(markups?.ul || "<h4 class=\"my-3\"><ul>")
            }
            currentText.push(`<li>${renderText(line.replace("* ", "")) }</li>`)

        } else if (line.trim().startsWith("|")) {
            if (!currentTable) {
                currentTable = true
                currentText.push("<table class=\"table table-hover\"><thead>")
                currentText.push(`<tr>${renderText(line).replaceAll("|", "<th>") }</tr></thead><tbody class="table-group-divider table-divider-color">`)
            } else if (!line.includes("---")) {
                currentText.push(`<tr>${renderText(line).replaceAll("|", "<td>") }</tr>`)
            }

        } else if (line.trim().startsWith("![")) {
            const split = line.trim().split("](")
            currentImage = `${ split[1].replace(")", "") },${ split[0].replace("![", "") }`
        } else {
            if (line.trim() === "" && !isCode) continue // ignore empty lines

            if (currentList) {
                currentList = false
                currentText.push("</ul></h4>")
            }

            if (line.startsWith("## ")) {
                if (currentList) {
                    currentList = false
                    currentText.push("</ul>")
                }

                if (currentTable) {
                    currentTable = false
                    currentTable.push("</tbody></table>")
                }

                if (currentText.length !== 0) {
                    const section = { text: currentText }
                    currentText = []
                    if (currentImage) {
                        section.image = currentImage
                    }
                    sections.push(section)
                    currentImage = false
                }

                currentText.push(`${ markups?.h2 || "<h2 class=\"my-3\">" }${ renderText(line.replace("## ", "")) }</h2>`)

            } else if (line.startsWith("### ")) {
                currentText.push(`${ markups?.h3 || "<h3 class=\"mt-5\">" }${ renderText(line.replace("### ", "")) }</h3>`)

            } else if (line.startsWith("```js")) {
                currentCode = ["<h5 class=\"my-3\"><pre><code>"]
                isCode = true

            } else if (line.startsWith("```")) {
                currentCode.push("</code></pre></h5>")
                currentText.push(currentCode.join("\n"))
                isCode = false

            } else if (isCode) {
                currentCode.push(line.replace(/</g, "&lt;").replace(/>/g, "&gt;"))

            } else{
                currentText.push(`${ markups?.p || "<p class=\"my-3\">" }${renderText(line)}</p>`)
            }
        }
    }

    if (currentList) {
        currentList = false
        currentText.push("</ul>")
    }

    if (currentTable) {
        currentTable = false
        currentTable.push("</tbody></table>")
    }

    if (currentText.length !== 0) {
        const section = { text: currentText }
        if (currentImage) {
            section.image = currentImage
        }
        sections.push(section)
        currentImage = false
    }

    currentPage.sections = sections
    pages.push(currentPage)

    return pages
}

module.exports = {
    mdToJson
}