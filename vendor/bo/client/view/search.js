
const renderSearchSelect = (context, propertyId, property, modalities) => {

    let restriction = null

    const multiple = (property.options.multiple) ? true : false

    const renderModalities = (modalities) => {

        let options = []
        for (let modalityId of Object.keys(modalities)) {
            const modality = modalities[modalityId]
            let clas =`restrictionParentOption-${propertyId}`
            if (property.options.restrictions) {
                clas += " restriction"
                const restrictions = []
                for (let restriction of property.options.restrictions) {
                    const restrictionProperty = restriction.property
                    clas += ` restriction-${restriction.parent} restriction-${restriction.parent}-${modality.properties[restrictionProperty].join('|')}`
                }
            }    
            options.push(`<option value="${modalityId}" class="${clas}" id="search-${propertyId}-${modalityId}">${modality}</option>`)
        }
        return options.join("\n")
    }

    return `<input type="hidden" value="0" class="searchCheckValue" id="searchCheckValue-${propertyId}" />
    <div class="input-group-prepend">
        <button type="button" class="btn btn-secondary input-group-text searchCheck" id="searchCheck-${propertyId}">${context.localize(property.labels)}</button>
    </div>
    <select class="form-control searchInput searchInputSelect ${(multiple) ? "selectpicker searchSelectpicker" : ""} ${(property.options.restrictionParent) ? `restrictionParent restrictionParent-${propertyId}` : ""}" id="search-${propertyId}" data-none-selected-text ${(multiple) ? "multiple" : ""}>
        ${(multiple) ? `<option value="empty">-- ${context.translate("Not provided")} --</option>` : ""}
        ${(!multiple) ? `<option value="" class="restrictionParentOption-${propertyId}" id="search-${propertyId}"></option>` : ""}
        ${renderModalities(modalities)}
    </select>`
}
