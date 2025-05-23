const getModalSearchParams = () => {
    
    const searchParams = {}
    
    $(".fl-modal-list-search-select").each(function () {
        let propertyId = $(this).attr("data-fl-property")
        let value = $(this).val()

        if (Array.isArray(value)) {
            value = value.map(values => {
                if (values == "empty") {
                    return "" 
                }
                else return values
            })
            value = value.join(",")
        }
        if (value) searchParams[propertyId] = value
    })

    $(".fl-modal-list-search-tag").each(function () {
        let propertyId = $(this).attr("data-fl-property")
        let value = $(this).val()

        if (Array.isArray(value)) {
            value = value.map(values => {
                if (values == "empty") {
                    return "" 
                }
                else return values
            })
            value = value.join(",")
        }
        if (value) searchParams[propertyId] = value
    })

    $(".fl-modal-list-search-input").each(function () {
        let propertyId = $(this).attr("data-fl-property")
        let value = $(this).val()
        if (value.length >= 2) { searchParams[propertyId] = `contains,${value}` }
    })

    $(".fl-modal-list-search-min").each(function () {
        let propertyId = $(this).attr("data-fl-property")
        let value = $(this).val()
        if (value.length >= 2) {
            if (!searchParams[propertyId]) searchParams[propertyId] = [null, null]
            searchParams[propertyId][0] = value
        }
    })

    $(".fl-modal-list-search-max").each(function () {
        let propertyId = $(this).attr("data-fl-property")
        let value = $(this).val()
        if ((value.length >= 2) && value) { 
            if (!searchParams[propertyId]) searchParams[propertyId] = [null, null]
            searchParams[propertyId][1] = value
        }
    })

    $(".fl-modal-list-search-date-min").each(function () {
        let propertyId = $(this).attr("data-fl-property")
        let value = $(this).val()
        if (value.length >= 2) {
            if (!searchParams[propertyId]) searchParams[propertyId] = [null, null]
            value = value.split("/")
            value = `${value[2]}-${value[1]}-${value[0]}`            
            searchParams[propertyId][0] = value
        }
    })

    $(".fl-modal-list-search-date-max").each(function () {
        let propertyId = $(this).attr("data-fl-property")
        let value = $(this).val()
        if ((value.length >= 2) && value) { 
            if (!searchParams[propertyId]) searchParams[propertyId] = [null, null]
            value = value.split("/")
            value = `${value[2]}-${value[1]}-${value[0]}`            
            searchParams[propertyId][1] = value
        }
    })

    let params = {}
    for (const key of Object.keys(searchParams)) {
        let value = searchParams[key]
        if (Array.isArray(value)) {
            if (value[0] == null) value = `le,${value[1]}`
            else if (value[1] == null) value = `ge,${value[0]}`
            else value = `between,${value[0]},${value[1]}`
        }
        params[key] = value
    }
    return params
}
