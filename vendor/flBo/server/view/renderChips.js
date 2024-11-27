const renderChips = ({ context, entity, view} , properties) => {

    let filters = []
    for (let propertyId of Object.keys(properties)) {
        const property = properties[propertyId] 

        filters.push(
            `<div class="chip chip-outline btn-outline-primary fl-search-shortcut" id="flSearchShortcut-${propertyId}" data-mdb-chip-init data-mdb-ripple-color="dark" data-property-id="${propertyId}">
                ${ context.localize(property.labels) }&nbsp;&nbsp;<i class="fas fa-times fl-search-shortcut-close" data-property-id="${propertyId}"></i>
            </div>`
        )
    }

    return filters.join("\n")
}

module.exports = {
    renderChips
}
