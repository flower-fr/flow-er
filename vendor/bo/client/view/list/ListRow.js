import View from "../View.js"
import ListCell from "./ListCell.js"

export default class ListRow extends View
{
    constructor({ controller, row, properties, translations }) {
        super({ controller })
        this.row = row
        this.properties = properties
        this.translations = translations
        this.listCells = []

        this.listRowColumns = []
        for (const [propertyId, property] of Object.entries(properties)) {
            this.listCells.push(new ListCell({ controller, row, propertyId, property, translations }))
        }
    }

    initialize = async () => {}

    render = () =>
    {
        const html = [], row = this.row, translations = this.translations

        html.push(`
        <tr class="listRow">
            <td>
                <div class="text-center">
                    <input type="checkbox" class="fl-list-check" id="flListCheck-${ row.id }"></input>
                </div>
            </td>

            <td class="text-center">
                <a 
                    href="#!"
                    class="text-primary"
                    id="flListDetail-${ row.id }"
                    title="${ translations["Detail"] }"
                    data-bs-toggle="modal"
                    data-mdb-modal-init
                    data-mdb-target="#flModalToggle1"
                >
                    <i class="fas fa-search"></i>
                </a>
            </td>

            ${ this.listCells.map(cell => cell.render()).join("\n") }

        </tr>`)

        return html.join("\n")
    }

    trigger = () => {}
}
