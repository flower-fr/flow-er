const renderModalListHeader = ({ context }, section, modalListConfig, properties, order = "-touched_at") => {

    let direction = "+"
    if (order[0] == "-") {
        direction = "-"
        order = order.substring(1)
    }
    const head = []

    const searchInputs = []
    if (section.search) {
        for (const item of section.search) {

            searchInputs.push(`
                <div class="input-group my-2 mx-2">`)

            if (["datemin", "datemax"].includes(item.type)) {
                searchInputs.push(`
                    <div class="form-outline w-auto fl-modal-list-search-date-outline" data-mdb-datepicker-init data-mdb-input-init data-mdb-inline="true">
                        <input type="search" class="form-control form-control-sm fl-modal-list-search-date-min" />
                        <label class="form-label" for="search-input-dropdown">${context.translate( (item.type == "datemin") ? "Date min" : "Date max" )}</label>
                    </div>`)
            }
            else {
                searchInputs.push(`
                    <div class="form-outline fl-modal-list-search-form-outline" data-mdb-input-init>
                        <input type="search" class="form-control form-control-sm fl-modal-list-search-input" />
                    </div>`)
            }

            searchInputs.push("</div>")

        }
    }

    head.push(`
        <thead class="datatable-header" id="flModalListSearchHead">
            <tr>`)

    head.push(`
                <th class="text-center">
                    ${ (section.search) ? `
                        <a
                            class="dropdown-toggle hidden-arrow btn btn-primary"
                            href="#"
                            id="navbarDropdownMenuLink"
                            role="button"
                            data-mdb-dropdown-init
                            data-mdb-ripple-init
                            data-mdb-auto-close="false"
                            aria-expanded="false"
                        >
                            <i class="fas fa-sync-alt"></i>
                        </a>
                        <ul class="dropdown-menu dropdown-menu-left" id="flModalListSearch" aria-labelledby="navbarDropdownMenuLink" data-mdb-theme="dark">
                            <li>
                                <div class="input-group mt-2 mx-2">
                                    <div class="form-outline form-outline-sm w-auto" data-mdb-input-init>
                                        <input type="search" class="form-control" />
                                        <label class="form-label" for="search-input-dropdown">Mots clés recherchés</label>
                                    </div>
                                    <button type="button" class="btn btn-sm btn-primary" data-mdb-ripple-init>
                                        <i class="fas fa-sync-alt"></i>
                                    </button>
                                </div>
                            </li>
                            <li><hr class="dropdown-divider" /></li>
                            <li>
                                ${ searchInputs.join("\n") }
                            </li>
                        </ul>` 
        : "" }
                </th>`)

    for (const [propertyId, property] of Object.entries(properties)) {
        if (property.type != "hidden" && Object.keys(property).length > 0) {
    
            head.push(`
                <th scope="col" ${ (property.options.width) ? `style="width: ${ property.options.width }"` : "" }>
                    ${ (property.options.anchor) ? `<button type="button" class="btn btn-link fl-modal-list-order-button" data-fl-property="${propertyId}" ${ (propertyId == order) ? `data-fl-direction="${direction}"` : "" } data-mdb-ripple-init data-mdb-ripple-color="dark">` : "<div>" }
                        <span class="fl-modal-list-header-label">
                            ${ context.localize(property.labels) }
                            ${ (propertyId == order) ? `<i class="fas ${ (direction == "+") ? "fa-arrow-down-short-wide " : "fa-arrow-down-wide-short" }"></i>` : "" }
                        </span>
                    ${ (property.options.anchor) ? "</button>" : "</div>" }
                </th>`)
        }
    }

    head.push(`
            </tr>`)

    head.push("</thead>")

    return head.join("\n")
}
