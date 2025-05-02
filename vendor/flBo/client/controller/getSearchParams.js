const getSearchParams = () => {
    
    const searchParams = {}
    
    $(".fl-search-select").each(function () {
        let propertyId = $(this).attr("data-property-id")
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

    $(".fl-search-tag").each(function () {
        let propertyId = $(this).attr("data-property-id")
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

    $(".fl-search-input").each(function () {
        let propertyId = $(this).attr("data-property-id")
        let value = $(this).val()
        if (value.length >= 2) { searchParams[propertyId] = `contains,${value}` }
    })

    $(".fl-search-min").each(function () {
        let propertyId = $(this).attr("data-property-id")
        let value = $(this).val()
        if (value.length >= 2) {
            if (!searchParams[propertyId]) searchParams[propertyId] = [null, null]
            searchParams[propertyId][0] = value
        }
    })

    $(".fl-search-max").each(function () {
        let propertyId = $(this).attr("data-property-id")
        let value = $(this).val()
        if ((value.length >= 2) && value) { 
            if (!searchParams[propertyId]) searchParams[propertyId] = [null, null]
            searchParams[propertyId][1] = value
        }
    })

    $(".fl-search-date-min").each(function () {
        let propertyId = $(this).attr("data-property-id")
        let value = $(this).val()
        if (value.length >= 2) {
            if (!searchParams[propertyId]) searchParams[propertyId] = [null, null]
            value = value.split("/")
            value = `${value[2]}-${value[1]}-${value[0]}`            
            searchParams[propertyId][0] = value
        }
    })

    $(".fl-search-date-max").each(function () {
        let propertyId = $(this).attr("data-property-id")
        let value = $(this).val()
        if ((value.length >= 2) && value) { 
            if (!searchParams[propertyId]) searchParams[propertyId] = [null, null]
            value = value.split("/")
            value = `${value[2]}-${value[1]}-${value[0]}`            
            searchParams[propertyId][1] = value
        }
    })

    let params = []
    for (const key of Object.keys(searchParams)) {
        let value = searchParams[key]
        if (Array.isArray(value)) {
            if (value[0] == null) value = `le,${value[1]}`
            else if (value[1] == null) value = `ge,${value[0]}`
            else value = `between,${value[0]},${value[1]}`
        }
        params.push(key + ":" + value)
    }
    return params
}

export { getSearchParams }