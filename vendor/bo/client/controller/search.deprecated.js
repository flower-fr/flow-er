const searchSelectTags = (propertyId, restrictions, continuations = {}) => {
    const xhttp = new XMLHttpRequest(), route = getSearchTagsRoute(propertyId)
    xhttp.open("GET", route, true)
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4) {
            if (xhttp.status == 401) getLogin(loadPage)
            else if (xhttp.status == 200) {

                if (xhttp.statusText.substring(0, 3) == "jwt") {
                    document.cookie = `JWT-${$("#instanceCaption").val()}${xhttp.statusText.substring(4)};path=/`
                }
                const data = JSON.parse(xhttp.responseText)

                $(`#searchSelectDiv-${propertyId}`).html(renderSearchTags(propertyId, data, restrictions))

                $(`#search-${propertyId}`).selectpicker()
                $(`#search-${propertyId}`).change(function () {
                    $("#refreshButton").removeClass("btn-default").addClass("btn-warning")
                    $("#refreshButton").attr("disabled", false)
                    $("#eraseButton").removeClass("btn-default").addClass("btn-success")
                    $("#eraseButton").attr("disabled", false)
                    $("#searchCheck-" + propertyId).removeClass("btn-default").addClass("btn-secondary").addClass("active")
                    $("#searchCheckValue-" + propertyId).val("1")
                    $(".shortcut-chip").removeClass("bg-primary").addClass("bg-light")
                })
                $(`#searchCheck-${propertyId}`).click(function() {
                    $("#refreshButton").removeClass("btn-default").addClass("btn-warning")
                    $("#refreshButton").attr("disabled", false)
                    $("#eraseButton").removeClass("btn-default").addClass("btn-success")
                    $("#eraseButton").attr("disabled", false)
                    const check = `searchCheckValue-${propertyId}`
                    if ($("#" + check).val() == "1") {
                        $(this).removeClass("btn-secondary").addClass("btn-default").removeClass("active")
                        $("#" + check).val("0")
                        $("#search-" + propertyId).val("")
                        $("#searchMin-" + propertyId).val("")
                        $("#searchMax-" + propertyId).val("")
                        $("#search-" + propertyId).selectpicker("refresh")
                    }
                    else {
                        $(this).removeClass("btn-default").addClass("btn-secondary").addClass("active")
                        $("#" + check).val("1")
                    }
                    $(".shortcut-chip").removeClass("bg-primary").addClass("bg-light")
                })

                for (const key of Object.keys(continuations)) {
                    if (propertyId == key) {
                        const continuation = continuations[key]
                        for (const key of Object.keys(continuation)) {
                            $(`#search-${key}`).change(() => {
                                const restrictions = {}
                                for (const restrictionKey of Object.keys(continuation)) {
                                    const val = $(`#search-${restrictionKey}`).val()
                                    if (val.length) restrictions[continuation[restrictionKey]] = val
                                }
                                searchSelectTags(propertyId, restrictions)
                            })
                        } 
                    }
                }
            }
        }
    }
    xhttp.send()
}

const searchSelectDynamic = async (context, entity, view, propertyId, restrictions, continuations = {}) => {

    const sourceConfig = context.config[`${entity}/property/${propertyId}`]
    sourceConfig.options = context.config[`${entity}/search/${view}`].properties[propertyId]

    const query = []
    if (sourceConfig.where) query.push(`where=${sourceConfig.where}`)
    if (sourceConfig.order) query.push(`order=${sourceConfig.order}`)
    if (sourceConfig.view) query.push(`view=${sourceConfig.view}`)
    const format = sourceConfig.format[0].split("%s"), paramKeys = sourceConfig.format[1].split(","), params = []
    for (let key of paramKeys) params[key] = context.config[`${sourceConfig.entity}/property/${key}`]
    query.push(`columns=${sourceConfig.format[1]}`)

    const response = await fetch(`/bo/api/${sourceConfig.entity}?${query.join("&")}`)
    const modalities = {}
    for (let row of await response.json()) {
        const key = (sourceConfig.key) ? sourceConfig.key : "id"
        const value = []
        for (let i = 0; i < format.length; i++) {
            value.push(format[i])
            if (i < format.length - 1) {
                const argument = row[paramKeys[i]], param = params[paramKeys[i]]
                if (param.type == "select") value.push(context.localize(param.modalities[argument]))
                else value.push(argument)
            }
        }
        modalities[row[key]] = value.join("")
    }

    $(`#searchSelectDiv-${propertyId}`).html(renderSearchSelect(context, propertyId, sourceConfig, modalities, restrictions))
    const value = $(`#searchInputValue-${propertyId}`).val()
    if (value) {
        $("#searchCheck-" + propertyId).removeClass("btn-default").addClass("btn-secondary").addClass("active")
        $("#searchCheckValue-" + propertyId).val("1")
        $(`#search-${propertyId}`).val(value)
        getList(context, entity, view, getSearchParams())
    }

    $(`#search-${propertyId}`).selectpicker()
    $(`#search-${propertyId}`).change(function () {
        $("#refreshButton").removeClass("btn-default").addClass("btn-warning")
        $("#refreshButton").attr("disabled", false)
        $("#eraseButton").removeClass("btn-default").addClass("btn-success")
        $("#eraseButton").attr("disabled", false)
        $("#searchCheck-" + propertyId).removeClass("btn-default").addClass("btn-secondary").addClass("active")
        $("#searchCheckValue-" + propertyId).val("1")
        $(".shortcut-chip").removeClass("bg-primary").addClass("bg-light")
    })
    $(`#searchCheck-${propertyId}`).click(function() {
        $("#refreshButton").removeClass("btn-default").addClass("btn-warning")
        $("#refreshButton").attr("disabled", false)
        $("#eraseButton").removeClass("btn-default").addClass("btn-success")
        $("#eraseButton").attr("disabled", false)
        const check = `searchCheckValue-${propertyId}`
        if ($("#" + check).val() == "1") {
            $(this).removeClass("btn-secondary").addClass("btn-default").removeClass("active")
            $("#" + check).val("0")
            $("#search-" + propertyId).val("")
            $("#searchMin-" + propertyId).val("")
            $("#searchMax-" + propertyId).val("")
            $("#search-" + propertyId).selectpicker("refresh")
        }
        else {
            $(this).removeClass("btn-default").addClass("btn-secondary").addClass("active")
            $("#" + check).val("1")
        }
        $(".shortcut-chip").removeClass("bg-primary").addClass("bg-light")
    })

    for (const key of Object.keys(continuations)) {
        if (propertyId == key) {
            const continuation = continuations[key]
            for (const key of Object.keys(continuation)) {
                $(`#search-${key}`).change(() => {
                    const restrictions = {}
                    for (const restrictionKey of Object.keys(continuation)) {
                        const val = $(`#search-${restrictionKey}`).val()
                        if (val.length) restrictions[continuation[restrictionKey]] = val
                    }
                    searchSelectDynamic(context, entity, view, propertyId, restrictions)
                })
            } 
        }
    }
}

const getSearch = async (context, entity, view) => {
    let route = $("#searchRoute").val()

    let response = await fetch(route)
    if (!response.ok) {
        switch (response.status) {
        case 401:
            getLogin(loadPage)
            return
        case 500:
            toastr.error("A technical error has occured. PLease try again later")
            return
        }
    }

    const html = await response.text()
    $("#searchPanel").html(html)

    let refresh = function () {
        $("#refreshButton").removeClass("btn-warning").addClass("btn-default")
        $("#refreshButton").attr("disabled", "disabled")
        getList(context, entity, view, getSearchParams())
    }
    // Trigger the Entry key event that refreshes the list
    $(document).keyup(function(e) {    
        if (e.keyCode == 13) {
            refresh()
        }
    })
    
    // Connect the refresh button that refreshes the list
    $("#refreshButton").click(refresh)

    // Connect the erase button that reset all the search engine inputs and checks and refresh the list
    $("#eraseButton").click(function() {
        $(".searchInput").val("")
        $(".searchSelectpicker").selectpicker("refresh")
        $(".searchCheckValue").val("0")
        $(".searchCheck").removeClass("btn-secondary").addClass("btn-default").removeClass("active")
        getList(context, entity, view, getSearchParams())
    })

    $(".searchSelectpicker").selectpicker("refresh")
    
    // Connect the date picker on date inputs
    $(".searchInputDate").datepicker()

    // Trigger the change event on date inputs and refresh the list
    $(".searchInputDate").change(function () {
        var propertyId = $(this).attr("id").split("-")[1]
        $("#refreshButton").removeClass("btn-default").addClass("btn-warning")
        $("#refreshButton").attr("disabled", false)
        $("#eraseButton").removeClass("btn-default").addClass("btn-success")
        $("#eraseButton").attr("disabled", false)
        $("#searchCheck-" + propertyId).removeClass("btn-default").addClass("btn-secondary").addClass("active")
        $("#searchCheckValue-" + propertyId).val("1")
        $(".shortcut-chip").removeClass("bg-primary").addClass("bg-light")
    })

    $(".searchInputAge").keyup(function () {
        var propertyId = $(this).attr("id").split("-")[1]
        $("#refreshButton").removeClass("btn-default").addClass("btn-warning")
        $("#refreshButton").attr("disabled", false)
        $("#eraseButton").removeClass("btn-default").addClass("btn-success")
        $("#eraseButton").attr("disabled", false)
        $("#searchCheck-" + propertyId).removeClass("btn-default").addClass("btn-secondary").addClass("active")
        $("#searchCheckValue-" + propertyId).val("1")
        $(".shortcut-chip").removeClass("bg-primary").addClass("bg-light")
    })

    // Trigger the change event on number inputs and refresh the list
    $(".searchInputNumber").change(function () {
        var propertyId = $(this).attr("id").split("-")[1]
        $("#refreshButton").removeClass("btn-default").addClass("btn-warning")
        $("#refreshButton").attr("disabled", false)
        $("#eraseButton").removeClass("btn-default").addClass("btn-success")
        $("#eraseButton").attr("disabled", false)
        $("#searchCheck-" + propertyId).removeClass("btn-default").addClass("btn-secondary").addClass("active")
        $("#searchCheckValue-" + propertyId).val("1")
        $(".shortcut-chip").removeClass("bg-primary").addClass("bg-light")
    })

    // Trigger the change event on select inputs and refresh the list
    $(".searchInputSelect").change(function () {
        var propertyIdAttr = $(this).attr("id")
        if (propertyIdAttr) {
            var propertyId = propertyIdAttr.split("-")[1]
            $("#refreshButton").removeClass("btn-default").addClass("btn-warning")
            $("#refreshButton").attr("disabled", false)
            $("#eraseButton").removeClass("btn-default").addClass("btn-success")
            $("#eraseButton").attr("disabled", false)
            $("#searchCheck-" + propertyId).removeClass("btn-default").addClass("btn-secondary").addClass("active")
            $("#searchCheckValue-" + propertyId).val("1")
            $(".shortcut-chip").removeClass("bg-primary").addClass("bg-light")
        }
    })

    // Trigger the keyup event on text inputs and refresh the list
    $(".searchInputText").keyup(function () {
        var propertyId = $(this).attr("id").split("-")[1]
        $("#refreshButton").removeClass("btn-default").addClass("btn-warning")
        $("#refreshButton").attr("disabled", false)
        $("#eraseButton").removeClass("btn-default").addClass("btn-success")
        $("#eraseButton").attr("disabled", false)
        $("#searchCheck-" + propertyId).removeClass("btn-default").addClass("btn-secondary").addClass("active")
        $("#searchCheckValue-" + propertyId).val("1")
        $(".shortcut-chip").removeClass("bg-primary").addClass("bg-light")
    })

    // Trigger the click event on per-property checks (allowing to search on empty values) and refresh the list
    $(".searchCheck").click(function() {
        $("#refreshButton").removeClass("btn-default").addClass("btn-warning")
        $("#refreshButton").attr("disabled", false)
        $("#eraseButton").removeClass("btn-default").addClass("btn-success")
        $("#eraseButton").attr("disabled", false)
        var propertyId = $(this).attr("id").split("-")[1], check = "searchCheckValue-" + propertyId
        if ($("#" + check).val() == "1") {
            $(this).removeClass("btn-secondary").addClass("btn-default").removeClass("active")
            $("#" + check).val("0")
            $("#search-" + propertyId).val("")
            $("#searchMin-" + propertyId).val("")
            $("#searchMax-" + propertyId).val("")
            $("#search-" + propertyId).selectpicker("refresh")
        }
        else {
            $(this).removeClass("btn-default").addClass("btn-secondary").addClass("active")
            $("#" + check).val("1")
        }
        $(".shortcut-chip").removeClass("bg-primary").addClass("bg-light")
    })

    $(".searchSelectTags").each(function () {
        const propertyId = $(this).attr("id").split("-")[1]
        searchSelectTags(propertyId, {}, {}/*getSearchRestrictions(propertyId)*/)
    })

    $(".searchSelectDynamic").each(function () {
        const propertyId = $(this).attr("id").split("-")[1]
        searchSelectDynamic(context, entity, view, propertyId, {}, {}/*getSearchRestrictions(propertyId)*/)
    })

    // Connect the global actions buttons
    $(".globalButton").click(function () {
        const actionId = $(this).attr("id").split("-")[1]
        getGlobal(actionId)
    })

    //Connect the comment actions buttons 
    $(".commentButton").click(function () {
        const actionId = $(this).attr("id").split("-")[1]
        getComment(actionId)
    })
}
