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
        // const config = await fetch(`/bo/document/${ this.entity }?view=${ this.view }`)
        // const { properties, translations } = await config.json()
        // this.properties = properties
        // this.translations = translations

        const response = await fetch(`/document/v1/document_cell/${ documentId }`)
        this.data = await response.json()
        // const cells = await config.json()
        // Algorithlme de dénormalisation à créer
        const config = {
            levels: [ "header", "packs", "sections", "valueAttributes", "cells" ],
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
        const html = []

        html.push(`
        <table class="table">
            <thead>
                <tr>
                    <th scope="col" colspan="5">
                        <h2>${ this.document.header.content.name }</h2>
                        <p>${ this.document.header.content.description }</p>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <th></th>
        `)

        this.document.packs.forEach(pack => {
            html.push(`
                    <th>
                        <h3>${ pack.content.name }</h3>
                        <p>${ pack.content.description }</p>
                    </th>
            `)
        })

        html.push(`
                </tr>
        `)

        this.document.sections.forEach(section => {
            html.push(`
                <tr>
                    <th>
                        <h3>${ section.content.name }</h3>
                        <p>${ section.content.description }</p>
                    </th>
                </tr>
            `)
            section.childCells.forEach(valueAttribute => {
                html.push(`
                <tr>
                    <th>
                        <h4>${ valueAttribute.content.name }</h4>
                        <p>${ valueAttribute.content.description }</p>
                    </th>
                `)
                console.log({valueAttribute})
                if (valueAttribute.childCells) valueAttribute.childCells.forEach(cell => {
                    html.push(`
                    <td>
                        <p>${ cell.content.value }</p>
                    </td>
                    `)
                })
                html.push(`
                </tr>
                `)
            })
        })

        html.push(`
                </tr>
            </tbody>
        </table>
        `)

        return html.join("\n")
    }

    trigger = () => {
        // if (mdb) {
        //     const element = document.getElementById("navbarDropdownMenuLink")
        //     new mdb.Dropdown(element)
        // }
    }
}
