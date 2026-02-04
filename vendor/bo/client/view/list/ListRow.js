
import { ListRowProperties } from "./ListRowProperties.js"

class ListRow
{
    constructor({ context, config, columns, row, i }) {
        this.context = context
        this.config = config
        this.columns = columns
        this.row = row
        this.i = i
        this.listRowProperties = new ListRowProperties({ context, listConfig: config, columns, row })
    }

    render = () =>
    {
        const html = [], listConfig = this.config, row = this.row, context = this.context

        const checkData = []
        if (listConfig && listConfig.checkData) {
            for (const propertyId of listConfig.checkData) {
                checkData.push(`${propertyId}:${ encodeURIComponent(row[propertyId]) }`)
            }
        }

        // Deprecated
        const listCheckIds = []
        if (listConfig && listConfig.checkIds) {
            for (let checkId of listConfig.checkIds) {
                listCheckIds.push(`<input type="hidden" class="listCheckId-${row.id}" id="listCheckId-${row.id}-${checkId}" value="${row[checkId]}"></input>`)
            }
        }

        if (listConfig.hidden) {
            for (let propertyId of Object.keys(listConfig.hidden)) {
                html.push(`<input type="hidden" id="flListHidden-${ propertyId }-${ row.id }" value="${ row[propertyId] }" />`)
            }
        }

        html.push(`
        <tr class="listRow">
            <td>
                <div class="text-center">
                    <input type="checkbox" class="fl-list-check" id="flListCheck-${ row.id }" data-row-id="${this.i}" data-properties="${ checkData.join("|") }"></input>
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
                    title="${context.translate("Detail")}"
                    data-id="${row.id}"
                >
                <i class="fas fa-search"></i>
                </button>
            </td>

            ${ this.listRowProperties.render() }

        </tr>`)

        return html.join("\n")
    }

    trigger = () => {
    }
}

export { ListRow }
