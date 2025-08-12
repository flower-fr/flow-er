const renderDocumentSection = ({ context }, { section, properties, rows }) => {

    console.log("in renderDocumentSection (flBo)")

    const config = context.config[section.config]

    const html = []

    if (section.links) {
        const links = []
        for (const link of section.links) {
            links.push(`<a role="button" class="fl-modal-list-link" data-fl-tab="${ link.tab }">${ context.localize(link.labels) }</a>`)
        }

        html.push(`
        <div class="row">${ links.join("/n") }</div>`)
    }

    html.push(
        `       <div class="${ (config.class) ? config.class : "col-md-12" }">
                    <section class="mt-1">
                        ${ (config.labels) ? `<h6 class="my-3">${context.localize(config.labels)}</h6>`: "" }
                        <div class="row">`)

    if (config.format) html.push(renderHtmlItem({ context }, { config, properties, rows }))
    else if (config.table) html.push(renderHtmlTable({ context }, { config, properties, rows }))

    html.push(
        `               </div>
                    </section>
                </div>`
    )

    return html.join("\n")
}

const renderHtmlItem = ({ context }, { config, properties, rows }) => {
    const html = []
    for (const row of rows) {
        for (const item of config.format) {
            const value = (item.content) ? formatHtmlProperty({ context }, row, context.localize(item.content), properties) : ""
            const attributes = []
            for (const [key, value] of Object.entries((item.attributes) ? (item.attributes) : [])) {
                attributes.push(`${key}="${ formatHtmlProperty({ context }, row, context.localize(value), properties) }"`)
            }
            if (value || attributes.length != 0 || ["hr"].includes(item.tag)) {
                html.push(`${ (item.tag == "img") ? "<div>" : "" }<${ item.tag } ${ attributes.join("") }>${ value }</${ item.tag }>${ (item.tag == "img") ? "</div>" : "" }`)
            }
        }
    }

    return html.join("\n")
}

const renderHtmlTable = ({ context }, { config, properties, rows }) => {
    const html = []

    html.push(`<table
        ${ ( config.table.class ) ? `class="${ config.table.class }"` : "" }
        ${ ( config.table.style ) ? `style="${ config.table.style }"` : "" }
        ><thead
        ${ ( config.table.thead.class ) ? `class="${ config.table.thead.class }"` : "" }
        ${ ( config.table.thead.style ) ? `style="${ config.table.thead.style }"` : "" }
        >
            <tr>`)

    for (const cell of config.table.thead.cells) {
        html.push(`<th ${ (cell.style) ? `style="${ cell.style }"` : "" }>${ context.localize(cell.content) }</th>`)
    }

    html.push(`</tr>
        </thead>`)

    html.push(`<tbody
        ${ ( config.table.tbody.class ) ? `class="${ config.table.tbody.class }"` : "" }
        ${ ( config.table.tbody.style ) ? `style="${ config.table.tbody.style }"` : "" }
        >`)

    for (const row of rows) {

        html.push("<tr>")

        for (const cell of config.table.tbody.cells) {
            html.push(`<td ${ (cell.style) ? `style="${ cell.style }"` : "" }>${ formatHtmlProperty({ context }, row, context.localize(cell.content), properties) }</td>`)
        }

        html.push("</tr>")
    }

    html.push("</tbody></table>")

    return html.join("\n")
}

const formatHtmlProperty = ({ context }, row, format, properties) => {
    let split = format.split("{")
    const result = [split[0]]
    for (let i = 1; i < split.length; i++) {
        const [propertyId, text] = split[i].split("}")
        const property = properties[propertyId]
        let value
        if (propertyId == "instance_caption") {
            value = context.instance.caption
        } else if (property && property.type == "date") {
            value = (row[propertyId]) ? moment(row[propertyId]).format("DD/MM/YYYY") : ""
        } else value = (row[propertyId]) ? row[propertyId] : ""
        result.push(value)
        result.push(text)
    }
    return result.join("")
}