import View from "../View.js"
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
        const config = await fetch(`/bo/document/${ this.entity }?view=${ this.view }`)
        const { properties, translations } = await config.json()
        this.properties = properties
        this.translations = translations

        const data = await fetch(`/document/v1/document-cell/${ documentId }`)
        const cells = await config.json()
        // Algorithlme de dénormalisation à créer
    }

    render = () =>
    {
        const html = [], menu = this.menu

        html.push(`
            `)

        html.push(`
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
