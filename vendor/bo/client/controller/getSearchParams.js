const getSearchParams = () => {

    const encodeDate = (value) => {
        return value.substr(6, 4) + "-" + value.substr(3, 2) + "-" + value.substr(0, 2)
    }
    
    const searchParams = {}
    
    $(".searchInputSelect").each(function () {
        if ($(this).attr("id")) {
            let propertyId = $(this).attr("id").split("-")[1]
            let value = $(`#search-${propertyId}`).val()

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
        }
    })

    $(".searchTagSelect").each(function () {
        if ($(this).attr("id")) {
            const propertyId = $(this).attr("id").split("-")[1]
            const value = $("#search-" + propertyId).val()
            let ids = ["in"]
            if (value) {
                for (const accountId of value) {
                    ids.push($(`#searchSelectTagsIds-${propertyId}-${accountId}`).val())
                }
                searchParams["id"] = ids.join(",")
            }
        }
    })

    $(".searchInputText").each(function () {
        let propertyId = $(this).attr("id").split("-")[1]
        let value = $(`#search-${propertyId}`).val()
        if (value.length >= 2) { searchParams[propertyId] = `contains,${value}` }
    })

    $(".searchInputDateMin").each(function () {
        let propertyId = $(this).attr("id").split("-")[1]
        let value = $("#searchMin-" + propertyId).val()
        if (value) value = encodeDate(value)
        if ((value.length >= 2) && value) {
            if (!searchParams[propertyId]) searchParams[propertyId] = [null, null]
            searchParams[propertyId][0] = value
        }
    })

    $(".searchInputDateMax").each(function () {
        let propertyId = $(this).attr("id").split("-")[1]
        let value = $("#searchMax-" + propertyId).val()
        if (value) value = encodeDate(value)
        if ((value.length >= 2) && value) { 
            if (!searchParams[propertyId]) searchParams[propertyId] = [null, null]
            searchParams[propertyId][1] = value
        }
    })

    $(".searchInputAgeMin").each(function () {
        let propertyId = $(this).attr("id").split("-")[1]
        let value = $(`#searchMin-${propertyId}`).val()
        if (value) {
            const date = new Date()
            let year = new Date.getFullYear() - value, month = String(date.getMonth() + 1).padStart(2, "0"), day = String(date.getDate()).padStart(2, "0")
            if (month == "02" && day == "29") day = "28"
            value = `${year}-${month}-${day}`
        }
        if ((value.length >= 2) && value) { 
            if (!searchParams[propertyId]) searchParams[propertyId] = [null, null]
            searchParams[propertyId][0] = value
        }
    })

    $(".searchInputAgeMax").each(function () {
        let propertyId = $(this).attr("id").split("-")[1]
        let value = $(`#searchMax-${propertyId}`).val()
        if (value) {
            const date = new Date()
            let year = new Date.getFullYear() - value, month = String(date.getMonth() + 1).padStart(2, "0"), day = String(date.getDate()).padStart(2, "0")
            if (month == "02" && day == "29") day = "28"
            value = year + "-" + month + "-" + day
        }
        if ((value.length >= 2) && value) { 
            if (!searchParams[propertyId]) searchParams[propertyId] = [null, null]
            searchParams[propertyId][1] = value
        }
    })

    $(".searchInputNumberMin").each(function () {
        let propertyId = $(this).attr("id").split("-")[1]
        let value = $(`#searchMin-${propertyId}`).val()
        if (value) { 
            if (!searchParams[propertyId]) searchParams[propertyId] = [null, null]
            searchParams[propertyId][0] = value
        }
    })

    $(".searchInputNumberMax").each(function () {
        let propertyId = $(this).attr("id").split("-")[1]
        let value = $(`#searchMax-${propertyId}`).val()
        if (value) {
            if (!searchParams[propertyId]) searchParams[propertyId] = [null, null]
            searchParams[propertyId][1] = value
        }
    })

    if (Object.keys(searchParams).length == 0) {
        const listWhereHidden = $("#listWhereHidden").val()
        if (listWhereHidden) {
            for (const pair of $("#listWhereHidden").val().split("|")) {
                const key = pair.split(":")[0], value = pair.split(":")[1]
                searchParams[key] = value
            }
        }
    }

    return searchParams
}

const getSearchParamsOld = () => {

    const encodeDate = (value) => {
        return value.substr(6, 4) + "-" + value.substr(3, 2) + "-" + value.substr(0, 2)
    }
    
    const searchParams = {}
    
    $(".searchInputSelect").each(function () {
        if ($(this).attr("id")) {
            let propertyId = $(this).attr("id").split("-")[1]
            let checked = $(`#searchCheckValue-${propertyId}`).val()
            let value = $(`#search-${propertyId}`).val()

            if (Array.isArray(value)) {
                value = value.map(values => {
                    if (values == "empty") {
                        return "" 
                    }
                    else return values
                })
                value = value.join(",")
            }
          
            if (checked == "1" ) {         
                searchParams[propertyId] = value
            }
        }
    })

    $(".searchTagSelect").each(function () {
        if ($(this).attr("id")) {
            const propertyId = $(this).attr("id").split("-")[1]
            const checked = $(`#searchCheckValue-${propertyId}`).val()
            const value = $("#search-" + propertyId).val()
            let ids = ["in"]
            if (checked == "1") {
                for (const accountId of value) {
                    ids.push($(`#searchSelectTagsIds-${propertyId}-${accountId}`).val())
                }
                searchParams["id"] = ids.join(",")
            }
        }
    })

    $(".searchInputText").each(function () {
        let propertyId = $(this).attr("id").split("-")[1]
        let checked = $(`#searchCheckValue-${propertyId}`).val()
        let value = $(`#search-${propertyId}`).val()
        if (value.length >= 2 || checked == "1") { searchParams[propertyId] = `contains,${value}` }
    })

    $(".searchInputDateMin").each(function () {
        let propertyId = $(this).attr("id").split("-")[1]
        let checked = $("#searchCheckValue-" + propertyId).val()
        let value = $("#searchMin-" + propertyId).val()
        if (value) value = encodeDate(value)
        if ((value.length >= 2 || checked == "1") && value) {
            if (!searchParams[propertyId]) searchParams[propertyId] = [null, null]
            searchParams[propertyId][0] = value
        }
    })

    $(".searchInputDateMax").each(function () {
        let propertyId = $(this).attr("id").split("-")[1]
        let checked = $("#searchCheckValue-" + propertyId).val()
        let value = $("#searchMax-" + propertyId).val()
        if (value) value = encodeDate(value)
        if ((value.length >= 2 || checked == "1") && value) { 
            if (!searchParams[propertyId]) searchParams[propertyId] = [null, null]
            searchParams[propertyId][1] = value
        }
    })

    $(".searchInputAgeMin").each(function () {
        let propertyId = $(this).attr("id").split("-")[1]
        let checked = $(`#searchCheckValue-${propertyId}`).val()
        let value = $(`#searchMin-${propertyId}`).val()
        if (value) {
            const date = new Date()
            let year = new Date.getFullYear() - value, month = String(date.getMonth() + 1).padStart(2, "0"), day = String(date.getDate()).padStart(2, "0")
            if (month == "02" && day == "29") day = "28"
            value = `${year}-${month}-${day}`
        }
        if ((value.length >= 2 || checked == "1") && value) { 
            if (!searchParams[propertyId]) searchParams[propertyId] = [null, null]
            searchParams[propertyId][0] = value
        }
    })

    $(".searchInputAgeMax").each(function () {
        let propertyId = $(this).attr("id").split("-")[1]
        let checked = $(`#searchCheckValue-${propertyId}`).val()
        let value = $(`#searchMax-${propertyId}`).val()
        if (value) {
            const date = new Date()
            let year = new Date.getFullYear() - value, month = String(date.getMonth() + 1).padStart(2, "0"), day = String(date.getDate()).padStart(2, "0")
            if (month == "02" && day == "29") day = "28"
            value = year + "-" + month + "-" + day
        }
        if ((value.length >= 2 || checked == "1") && value) { 
            if (!searchParams[propertyId]) searchParams[propertyId] = [null, null]
            searchParams[propertyId][1] = value
        }
    })

    $(".searchInputNumberMin").each(function () {
        let propertyId = $(this).attr("id").split("-")[1]
        let checked = $(`#searchCheckValue-${propertyId}`).val()
        let value = $(`#searchMin-${propertyId}`).val()
        if (checked == "1" && value) { 
            if (!searchParams[propertyId]) searchParams[propertyId] = [null, null]
            searchParams[propertyId][0] = value
        }
    })

    $(".searchInputNumberMax").each(function () {
        let propertyId = $(this).attr("id").split("-")[1]
        let checked = $(`#searchCheckValue-${propertyId}`).val()
        let value = $(`#searchMax-${propertyId}`).val()
        if (checked == "1" && value) {
            if (!searchParams[propertyId]) searchParams[propertyId] = [null, null]
            searchParams[propertyId][1] = value
        }
    })

    if (Object.keys(searchParams).length == 0) {
        const listWhereHidden = $("#listWhereHidden").val()
        if (listWhereHidden) {
            for (const pair of $("#listWhereHidden").val().split("|")) {
                const key = pair.split(":")[0], value = pair.split(":")[1]
                searchParams[key] = value
            }
        }
    }

    return searchParams
}