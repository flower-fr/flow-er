const renderChips = ({ context }, properties, indexConfig) => {

    let filters = []
    for (let propertyId of Object.keys(properties)) {
        const property = properties[propertyId] 

        filters.push(
            `<div class="chip chip-outline btn-outline-primary fl-search-shortcut" id="flSearchShortcut-${propertyId}" data-mdb-chip-init data-mdb-ripple-color="dark" data-property-id="${propertyId}">
                ${ context.localize(property.labels) }&nbsp;&nbsp;<i class="fas fa-times fl-search-shortcut-close" data-property-id="${propertyId}"></i>
            </div>`
        )
    }

    filters.push(`
        <section class="w-20 text-center pb-4">
            <div class="input-group mb-3">
                <button class="btn btn-outline-primary fl-search-refresh" type="button" data-mdb-ripple-init data-mdb-ripple-color="dark">
                    <i class="fas fa-search"></i>
                </button>
                <input
                    type="search"
                    class="form-control rounded fl-search-item fl-search-input"
                    placeholder="${ (indexConfig.keywords && indexConfig.keywords.placeholder) ? context.localize(indexConfig.keywords.placeholder) : context.translate("Search") }"
                    data-property-id="keywords"
                    id="flSearch-keywords"
                    aria-label="Search"
                    aria-describedby="search-addon"
                />
            </div>
        </section>`)
    
    return filters.join("\n")
}

module.exports = {
    renderChips
}
