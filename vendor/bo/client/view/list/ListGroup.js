import View from "../View.js"

export default class ListGroup extends View
{
    constructor({ controller, value, property, size, translations }) {
        super({ controller })
        this.value = value
        this.property = property
        this.size = size
        this.translations = translations
    }

    initialize = async () => {}

    render = () =>
    {
        const html = [], { value, property, size } = this

        const label = `${ ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"][parseInt(value.substr(5, 7)) - 1] } ${ value.substr(0, 4) }`
        html.push(`
        <tr class="listRow">
            <td colspan="2" />
            <td>${ label }</td>
            <td colspan="${ size - 1 }" />
        </tr>`)

        return html.join("\n")
    }
}
