
import { getSearchParams } from "/flBo/cli/controller/getSearchParams.js"
import { triggerList } from "/flBo/cli/controller/triggerList.js"
import { triggerTaskDetail } from "/flBo/cli/controller/triggerTaskDetail.js"
import { triggerTaskAdd } from "/flBo/cli/controller/triggerTaskAdd.js"

class Tasks
{
    constructor({ context, entity, view, data }) {
        this.context = context
        this.entity = entity
        this.view = view
        this.data = data
    }

    render = () =>
    {
        const html = [], context = this.context

        moment.locale("fr")
        const where = (this.data.where && this.data.where != null) ? this.data.where.split("|") : []
        let date = moment(), formatted =  context.translate("Current tasks") // `Jusqu’au ${ date.format("DD MMMM") }`
        for (let predicate of where) {
            const [key, value] = predicate.split(":")
            if (key === "date") {
                date = moment(value.split(",")[1])
                formatted = date.format("DD MMM")
            }
        }

        html.push(`
            <div class="calendar" id="calendar">
                <div class="calendar-tools">
                    <div class="d-flex flex-column flex-lg-row justify-content-center align-items-center">
                        <span class="calendar-heading" id="flTaskHeaderText">${ formatted }</span>
                        <button data-mdb-ripple-color="dark" class="btn btn-link fl-search-yesterday" data-fl-value="${ date.subtract(1, "days").format("DD/MM/YYYY") }" title="${ context.translate("Previous day") }"><i class="fas fa-chevron-left"></i></button>
                        <button data-mdb-ripple-color="dark" class="btn btn-link fl-search-tomorrow" data-fl-value="${ date.add(2, "days").format("DD/MM/YYYY") }" title="${ context.translate("Next day") }"><i class="fas fa-chevron-right"></i></button>
                    </div>
                    <div class="d-flex justify-content-center">
                        <button class="btn btn-primary fl-task-add" type="button" data-bs-toggle="modal" data-bs-target="#flModal" data-mdb-modal-init="" data-mdb-target="#flModal">Ajouter une tâche</button>
                    </div>
                </div>
                <table class="list">
                    <thead>
                        <tr></tr>
                    </thead>
                    <tbody>`)
        
        for (const row of this.data.rows) {

            let color, textClass = ""
            if (row.status == "done") color = "#c7f5d9"
            else if (row.date < moment().format("YYYY-MM-DD")) {
                color = "#fdd8de"
                textClass = "text-danger"
            }
            else color = "#cfe0fc"

            html.push(`
                <tr>
                    <th>
                        ${ context.decodeDate(row.date) }&nbsp;&nbsp;&nbsp;&nbsp;${ (row.time) ? row.time : "" }&nbsp;&nbsp;&nbsp;&nbsp;${ (row.owner_n_fn && row.owner_n_fn.trim()) ? `${ context.translate("Assigned to")} ${ row.owner_n_fn }` : "" }
                    </th>
                </tr>
                <tr>
                    <td class="fl-task-detail" data-bs-toggle="modal" data-bs-target="#flModal" data-mdb-modal-init="" data-mdb-target="#flModal" data-fl-id="${ row.id }">
                        <i class="pe-2 fas fa-circle" style="color: ${ color }"></i>
                        <strong class="${ textClass }">
                        ${ (row.n_fn && row.n_fn.trim() !== "") ? `${ row.n_fn }: ` : "" }${ row.summary }
                        </strong>
                        <p class="mb-0">
                            <small>
                                ${ (row.description) ? row.description : "" }
                            </small>
                        </p>
                    </td>
                </tr>`)
        }

        html.push(`
                    </tbody>
                </table>
            </div>`)

        return html.join("\n")
    }

    trigger = () =>
    {
        const context = this.context
        const entity = this.entity
        const view = this.view

        let params = []
        for (let [key, value] of Object.entries(getSearchParams())) {
            if (Array.isArray(value)) {
                if (value[0] == null) value = `<=,${value[1]}`
                else if (value[1] == null) value = `>=,${value[0]}`
                else value = `between,${value[0]},${value[1]}`
            }
            params.push(key + ":" + value)
        }

        $(".fl-search-yesterday").click(function () {
            $("#flSearchMin-date").val($(this).attr("data-fl-value"))
            $("#flSearchMax-date").val($(this).attr("data-fl-value"))
            triggerList({ context, entity, view })
        })

        $(".fl-search-tomorrow").click(function () {
            $("#flSearchMin-date").val($(this).attr("data-fl-value"))
            $("#flSearchMax-date").val($(this).attr("data-fl-value"))
            triggerList({ context, entity, view })
        })

        triggerTaskDetail({ context, entity, view }, params)

        triggerTaskAdd({ context, entity, view }, params)
    }
}

export { Tasks }
