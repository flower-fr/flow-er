import View from "../View.js"
import ListCell from "./ListCell.js"

export default class ListRow extends View
{
    constructor({ i, controller, row, filledColumns, properties, sumable, translations }) {
        super({ controller })
        this.i = i
        this.row = row
        this.filledColumns = filledColumns
        this.properties = properties
        this.sumable = sumable
        this.translations = translations
        this.listCells = []

        this.listRowColumns = []
        for (const [propertyId, property] of Object.entries(properties)) {
            if (this.filledColumns.includes(propertyId)) {
                this.listCells.push(new ListCell({ controller, row, propertyId, property, translations }))
            }
        }
    }

    initialize = async () => {}

    render = () =>
    {
        const html = [], i = this.i, row = this.row, translations = this.translations

        html.push(`
        <tr class="listRow">
            <td>
                <div class="text-center">
                    <input type="checkbox" id="flListCheck-${ i }"></input>
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
