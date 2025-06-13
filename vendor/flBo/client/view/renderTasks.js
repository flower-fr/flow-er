const renderTasks = ({ context, entity, view }, data) => {

    moment.locale("fr")
    
    let date, formatted
    if (!data.where || data.where == null) {
        date = moment()
        formatted = `Jusqu’au ${ date.format("DD MMMM") }`
    }
    else {
        let where = data.where.split(":")
        if (where.length === 2) {
            where = where[1].split(",")
            if (where[0] === "between" && where[1] === where[2]) {
                date = moment(where[1])
            }    
        }
        else date = moment()
        formatted = date.format("DD MMM")
    }

    const html = []

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
    
    for (const row of data.rows) {

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
