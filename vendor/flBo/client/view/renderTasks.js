const renderTasks = ({ context, entity, view }, data) => {

    const html = []

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
                        ${ row.summary }
                    </strong>
                    <p class="mb-0">
                        <small>
                            ${ (row.description) ? row.description : "" }
                        </small>
                    </p>
                </td>
            </tr>`)
    }

    return html.join("\n")
}
