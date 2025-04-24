const tableHeaderView = ({ context }, properties) => {

    const html = []

    html.push(`
        <div class="row">
            <section class="p-4 d-flex flex-wrap w-100">
                <section class="w-20 text-center">
                    <div class="input-group mb-1">
                        <button class="btn btn-outline-primary fl-modal-list-search-refresh" type="button" data-mdb-ripple-init="" data-mdb-ripple-color="dark">
                            <i class="fas fa-search"></i>
                        </button>
                        <input type="search" class="form-control form-control-sm form-icon-trailing rounded fl-modal-list-search fl-modal-list-search-input" id="flModalListSearchInput" placeholder="ex ${ moment().format("YYYY") }, ${ moment().format("MMMM") }, mot-clé..." data-fl-property="keywords">
                    </div>
                </section>
            </section>
        </div>
    `)

    html.push(`
        <thead class="datatable-header" id="flModalListSearchHead">
            <tr>
                <th/>`)

    for (const [propertyId, property] of Object.entries(properties)) {
        html.push(`
            <th scope="col">
                <span class="fl-modal-list-header-label">
                    ${ context.localize(property.labels) }
                </span>
            </th>`)
    }

    html.push(`
            </tr>
        </thead>`)

    return html.join("\n")
}

export { tableHeaderView }