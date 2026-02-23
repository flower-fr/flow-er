class ModalListHeader
{
    constructor({ context, section, properties, order: order = "-touched_at" })
    {
        this.context = context
        this.section = section
        this.properties = properties
        this.order = order
    }

    render = () =>
    {
        const context = this.context, section = this.section, properties = this.properties
        let order = this.order

        moment.locale("fr")
        let direction = "+"
        if (order[0] == "-") {
            direction = "-"
            order = order.substring(1)
        }
        const html = []

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
            html.push(`
                <div class="row">
                    <section class="p-4 d-flex flex-wrap w-100">
                        <section class="w-20 text-center">
                            <div class="input-group mb-1">
                                <button class="btn btn-outline-primary fl-modal-list-search-refresh" type="button" data-mdb-ripple-init="" data-mdb-ripple-color="dark">
                                    <i class="fas fa-search"></i>
                                </button>
                                <input type="search" class="form-control form-control-sm form-icon-trailing rounded fl-modal-list-search fl-modal-list-search-input" id="flModalListSearchInput" placeholder="Recherche par mot-clé" data-fl-property="keywords">
                                <!-- ${ searchInputs.join("\n") } -->
                            </div>
                        </section>
                    </section>
                </div>
            `)
        }

        html.push(`
            <table class="table table-sm table-hover table-responsive">
                <thead class="datatable-header" id="flModalListSearchHead">
                    <tr>
                        <th/>`)

        for (const [propertyId, property] of Object.entries(properties)) {
            if (!["hidden", "textarea"].includes(property.type) && Object.keys(property).length > 0) {
        
                html.push(`
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

        html.push(`
                </tr>`)

        html.push("</thead>")

        return html.join("\n")
    }

    trigger = () =>
    {
    }
}

export { ModalListHeader }