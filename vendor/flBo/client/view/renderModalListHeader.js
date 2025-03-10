const renderModalListHeader = ({ context }, section, modalListConfig, properties, order = "-touched_at") => {
    moment.locale("fr")
    let direction = "+"
    if (order[0] == "-") {
        direction = "-"
        order = order.substring(1)
    }
    const head = []

    const searchInputs = []
    if (section.search) {
        for (const item of section.search) {
            if (["datemin"].includes(item.type)) {
                searchInputs.push(`
                    <div class="form-outline w-auto fl-modal-list-search-date-outline" data-mdb-datepicker-init data-mdb-input-init data-mdb-inline="true">
                        <input type="search" class="form-control form-control-sm fl-modal-list-search fl-modal-list-search-date-min" id="flModalListSearchDateMin" data-fl-property="${ item.property }" />
                        <label class="form-label" for="flModalListSearchDateMin">${ context.translate("Date min") }</label>
                    </div>`)
            }
            else if (["datemax"].includes(item.type)) {
                searchInputs.push(`
                    <div class="form-outline w-auto fl-modal-list-search-date-outline" data-mdb-datepicker-init data-mdb-input-init data-mdb-inline="true">
                        <input type="search" class="form-control form-control-sm fl-modal-list-search fl-modal-list-search-date-max" id="flModalListSearchDateMax" data-fl-property="${ item.property }" />
                        <label class="form-label" for="flModalListSearchDateMax">${ context.translate("Date max" ) }</label>
                    </div>`)
            }
        }
    }

    if (section.search) {
        head.push(`
            <div class="row">
                <section class="p-4 d-flex flex-wrap w-100">
                    <section class="w-20 text-center">
                        <div class="input-group mb-1">
                            <button class="btn btn-outline-primary fl-modal-list-search-refresh" type="button" data-mdb-ripple-init="" data-mdb-ripple-color="dark">
                                <i class="fas fa-search"></i>
                            </button>
                            <input type="search" class="form-control form-control-sm form-icon-trailing rounded fl-modal-list-search fl-modal-list-search-input" id="flModalListSearchInput" placeholder="ex ${ moment().format("YYYY") }, ${ moment().format("MMMM") }, mot-clé..." data-fl-property="keywords">
                            <!-- ${ searchInputs.join("\n") } -->
                        </div>
                    </section>
                </section>
            </div>
        `)
    }

    if (false) {
        for (const item of section.search) {

            searchInputs.push(`
                <div class="input-group my-2 mx-2">`)

            if (["datemin"].includes(item.type)) {
                searchInputs.push(`
                    <div class="form-outline w-auto fl-modal-list-search-date-outline" data-mdb-datepicker-init data-mdb-input-init data-mdb-inline="true">
                        <input type="search" class="form-control form-control-sm fl-modal-list-search-date-min" id="flModalListSearchDateMin" data-fl-property="${ item.property }" />
                        <label class="form-label" for="flModalListSearchDateMin">${ context.translate("Date min") }</label>
                    </div>`)
            }
            else if (["datemax"].includes(item.type)) {
                searchInputs.push(`
                    <div class="form-outline w-auto fl-modal-list-search-date-outline" data-mdb-datepicker-init data-mdb-input-init data-mdb-inline="true">
                        <input type="search" class="form-control form-control-sm fl-modal-list-search-date-max" id="flModalListSearchDateMax" data-fl-property="${ item.property }" />
                        <label class="form-label" for="flModalListSearchDateMax">${ context.translate("Date max" ) }</label>
                    </div>`)
            }
            else {
                searchInputs.push(`
                    <div class="form-outline fl-modal-list-search-form-outline" data-mdb-input-init>
                        <input type="search" class="form-control form-control-sm fl-modal-list-search-input" data-fl-property="${ item.property }" />
                    </div>`)
            }

            searchInputs.push("</div>")

        }
    }

    if (false) {
        head.push(`
                    <div class="dropdown">
                        <button
                            class="dropdown-toggle hidden-arrow btn btn-primary"
                            href="#"
                            id="navbarDropdownMenuLink"
                            type="button"
                            data-mdb-dropdown-init
                            data-mdb-ripple-init
                            data-mdb-auto-close="false"
                            aria-expanded="false"
                        >
                            <i class="fas fa-sync-alt"></i>
                        </button>
                        <div class="dropdown-menu dropdown-menu-left" id="flModalListSearch" aria-labelledby="navbarDropdownMenuLink" data-mdb-theme="dark">
                            <li>
                                <div class="input-group mt-2 mx-2">
                                    <div class="form-outline form-outline-sm w-auto" data-mdb-input-init>
                                        <input type="search" class="form-control fl-modal-list-search-input" id="flModalListSearchInput" data-fl-property="keywords" />
                                        <label class="form-label" for="flModalListSearchInput">Mots clés recherchés</label>
                                    </div>
                                    <button type="button" class="btn btn-sm btn-primary fl-modal-list-search-refresh" data-mdb-ripple-init>
                                        <i class="fas fa-sync-alt"></i>
                                    </button>
                                </div>
                            </li>
                            <li><hr class="dropdown-divider" /></li>
                            <li>
                                ${ searchInputs.join("\n") }
                            </li>
                        </ul>
                    </div>`)
    }

    head.push(`
        <table class="table table-sm table-hover table-responsive">
            <thead class="datatable-header" id="flModalListSearchHead">
                <tr>
                    <th/>`)
console.log(properties)
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
