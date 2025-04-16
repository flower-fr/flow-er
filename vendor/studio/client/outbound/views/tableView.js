import { tableHeaderView } from "/studio/cli/outbound/views/tableHeaderView.js"
import { tableFormView } from "/studio/cli/outbound/views/tableFormView.js"
import { tableRowsView } from "/studio/cli/outbound/views/tableRowsView.js"

const tableView = ({ context, entity }, rows, properties) => {

    const html = []

    html.push(`
        <table class="table table-sm table-hover table-responsive">

            ${ tableHeaderView({ context }) }

            <tbody class="table-group-divider table-divider-color" id="flJsonBody">
                <tr class="fl-json-form">
        
                    ${ tableFormView({ context }, properties) }
        
                </tr>
                <tr class="fl-json-row">
                    <td class="text-center">
                        <button type="button" class="btn btn-sm btn-outline-primary index-btn fl-json-add-button" title="${context.translate("Add")}" id="flJsonAddButton" data-mdb-ripple-init>
                            <span class="fas fa-plus"></span>
                        </button>
                    </td>
                    <td colspan="${ Object.entries(properties).length }" />
                </tr>

                ${ tableRowsView({ context, entity }, properties, rows) }
            
            </tbody>
        </table>`)

    return html.join("\n")
}

export { tableView }