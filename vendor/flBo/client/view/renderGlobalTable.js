const renderGlobalTable = ({ context, entity, view }, data) => {

    console.log("In renderGlobalTable (flBo)")

    return `
    <div class="row">
        <div class="table-responsive">
            <div class="datatable col-md-12" data-mdb-datatable-init>
                <table class="table table-sm table-hover" id="listPanel">
                    <thead >

                        ${ renderGlobalTableHeaders({ context }, data[0]) }

                    </thead>
                    <tbody class="table-group-divider" id="listParent">

                        ${ renderGlobalTableRows({ context }, data) }

                    </tbody>
                </table>
            </div>
        </div>
    </div>`
}

const renderGlobalTableHeaders = ({ context }, data0) => {

    const head = ["<tr>"]

    for (const key of Object.keys(data0)) {
        head.push(`<th>
            ${ key }
        </th>`)    
    }

    head.push("</tr>")

    return head.join("\n")
}

const renderGlobalTableRows = ({ context }, rows) => {

    const html = []

    for (const row of rows) {

        html.push("<tr>")

        for (const [key, value] of Object.entries(row)) {
            html.push(`<td>${ value }</td>`)
        }

        html.push("</tr>")
    }

    return html.join("\n")
}
