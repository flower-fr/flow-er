import View from "../View.js"
import denormalizeDocument from "../../utils/denormalizeDocument.js"

export default class Document extends View
{
    constructor({ controller, entity, view })
    {
        super({ controller })
        this.entity = entity
        this.view = view
    }

    initialize = async () =>
    {
        const documentId = 1
        console.log("Document initialize", { entity: this.entity })
        // const config = await fetch(`/bo/document/${ this.entity }?view=${ this.view }`)
        // const { properties, translations } = await config.json()
        // this.properties = properties
        // this.translations = translations

        const response = await fetch(`/document/v1/document_cell/${ documentId }`)
        this.data = await response.json()
        // const cells = await config.json()
        // Algorithlme de dénormalisation à créer
        const config = {
            levels: [ "header", "sections", "valueAttributes", "packs", "cells" ],
            data: {
                header: {},
                sections: {},
                valueAttributes: { groupBy: "sections" },
                packs: {},
                cells: {},
            }
        }
        this.document = denormalizeDocument(this.data, config)
        console.log("Document initialize", { document: this.document })
    }

    render = () =>
    {
        const html = [], menu = this.menu

        html.push(`
<table class="table">
    <thead>
        <tr>
            <th scope="col" colspan="5">${this.document[0][0].identifier}</th>
        </tr>
    </thead>
    <tbody>
        `)

        this.document.splice(1).forEach(row => {
            html.push(`
        <tr>
            `)
            row.forEach(cell => {
                if (cell.level === 1 || cell.level === 2) {
                    html.push(`
            <th scope="col">${cell.identifier || ""}</th>
                    `)
                    return
                }
                else {
                    html.push(`
            <td scope="col">${cell.identifier || ""}</td>
                    `)
                }
            })
            html.push(`
        </tr>
            `)
        })

        html.push(`
    </tbody>
</table>
            `)

        return html.join("\n")
    }

    trigger = () => {
        if (mdb) {
            const element = document.getElementById("navbarDropdownMenuLink")
            new mdb.Dropdown(element)
        }
    }
}
