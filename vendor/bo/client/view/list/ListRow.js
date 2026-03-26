import View from "../View.js"
import { ListCell } from "./ListCell.js"

export default class ListRow extends View
{
    constructor({ controller, row, properties, translations }) {
        super({ controller })
        this.row = row
        this.properties = properties
        this.translations = translations

        this.listRowColumns = []
        for (const [propertyId, property] of properties) {
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
                <button 
                    type="button"
                    class="btn btn-sm btn-outline-primary index-btn fl-list-detail"
                    data-bs-toggle="modal"
                    data-bs-target="#flListDetailModalForm"
                    data-mdb-target="#flListDetailModalForm"
                    data-mdb-modal-init
                    title="${ translations["Detail"] }"
                >
                <i class="fas fa-search"></i>
                </button>
            </td>

            ${ this.listCells.map(cell => cell.render()).join("\n") }

        </tr>`)

        return html.join("\n")
    }

    trigger = () => {}
}
