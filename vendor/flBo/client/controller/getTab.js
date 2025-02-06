
const getTab = async ({ context, entity, view }, tab, route, id, message, searchParams, order) => {
    
    route = route.split("?")
    let query = (route[1]) ? route[1].split("&").map((x) => { return x.split("=") }) : []
    query = Object.fromEntries((new Map(query)).entries())

    let params = []
    for (let [key, value] of Object.entries(searchParams)) {
        if (Array.isArray(value)) {
            if (value[0] == null) value = `le,${value[1]}`
            else if (value[1] == null) value = `ge,${value[0]}`
            else value = `between,${value[0]},${value[1]}`
            params.push(key + ":" + value)
        }
        else params.push(value)
    }

    let where = (query.where) ? [query.where] : []
    where = where.concat(params)
    where = where.join("|")
    if (where) query.where = where

    if (order) query.order = order

    route = `${ route[0] }?`
    for (const [key, value] of Object.entries(query)) {
        if (key != "") route += `&${key}=${value}`
    }

    const response = await fetch(route)
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
    
    const data = await response.json()

    $(".renderDetailTab").each(function () { 
        const tabId = $(this).attr("id").split("-")[1]
        if (tabId == tab) {
            $("#detailPanel").html(renderDetailTab({ context, entity, view }, data))
            modalListCallback({ context, entity, view }, data)
        }
    })

    $(".renderUpdate").each(function () { 
        const tabId = $(this).attr("id").split("-")[1]
        if (tabId == tab) {
            $("#detailPanel").html(renderUpdate({ context, entity, view }, data))
            updateCallback({ context, entity, view }, data)
        }
    })

    $(".renderModalList").each(function () {
        const tabId = $(this).attr("id").split("-")[1]
        if (tabId == tab) {
            $("#detailPanel").html(renderModalList({ context, entity, view }, data)) 
            modalListCallback({ context, entity, view }, data)
        }
    })

    $(".renderGlobalTable").each(function () {
        const tabId = $(this).attr("id").split("-")[1]
        if (tabId == tab) {
            $("#detailPanel").html(renderGlobalTable({ context, entity, view }, data)) 
        }
    })

    $(".renderModalCalendar").each(function () {
        const tabId = $(this).attr("id").split("-")[1]
        if (tabId == tab) {
            $("#detailPanel").html(renderModalCalendar({ context, entity, view }, tabId, data)) 
            modalCalendarCallback({ context, entity, view }, tabId, data)
        }
    })

    triggerDetailTab({ context, entity, view }, data, tab, route, id, message, searchParams, order)

    $(".document-cancel-btn").hide()

    $(".updateMessage").hide()
    if (message == "ok") {
        $("#updateMessageOk").show()
        document.location = "#updateMessageOk"
    }
    else if (message == "expired") {
        $("#updateMessageExpired").show()
        document.location = "#updateMessageExpired"
    }
    else if (message == "consistency") {
        $("#updateMessageConsistency").show()
        document.location = "#updateMessageConsistency"
    }
    else if (message == "duplicate") {
        $("#updateMessageDuplicate").show()
        document.location = "#updateMessageDuplicate"
    }
    else if (message == "serverError") {
        $("#updateMessageServerError").show()
        document.location = "#updateMessageServerError"
    }

    $("#deleteButton").click(function () {
        $("#deleteButton").removeClass("btn-outline-primary").addClass("btn-danger")
        $("#deleteButton").click(function () {
            submitDelete({ context, entity, view }, id)
        })
    })
    
    checkForm()

    $(".input-iban").each(function () {
        const propertyId = $(this).attr("id")
        if ($(this).val() != "" && controleIBAN($(this).val()) != 0) {
            $(this).addClass("is-invalid")
            $(`#inputError-${propertyId}`).text("Invalid IBAN")
            $(".submit-button").addClass("disabled")
        }
    })

    $(".updateIban").change(function () {
        const propertyId = $(this).attr("id")
        if ($(this).val() != "" && controleIBAN($(this).val()) != 0) {
            $(this).addClass("is-invalid")
            $(`#inputError-${propertyId}`).text("Invalid IBAN")
            $(".submitButton").addClass("disabled")
        }
        else {
            $(".submitButton").removeClass("disabled")
            $(this).removeClass("is-invalid")
            $(`#inputError-${propertyId}`).text("")
        }
    })
    
    $(".datepicker").datepicker()
    //$(".updateDatetimeDate").datepicker()
    $(".timepicker").timepicker({ "timeFormat":"H:i:s", "step": 15, "scrollDefault": "now" })
    //$(".updateDatetimeTime").timepicker({ "timeFormat":"H:i:s", "step": 15, "scrollDefault": "now" })
    //$(".updateSelectpicker").selectpicker()

    $(".updateHistory").each(function () {
        const propertyId = $(this).attr("id").split("-")[1]
        getHistory(propertyId)
    })

    $(".updateSelectRoute").each(function () {
        const propertyId = $(this).attr("id").split("-")[1]
        getSelect(propertyId)
    })

    /**
     * Tags
     */
    $(".update-chip-div").each(function () {
        const matched = parseInt($(this).attr("data-chip-div-matched"))
        if (!matched) $(this).hide()
    })

    $(".update-chip-a").click(function () { 
        const tagId = $(this).attr("data-chip-btn-tag-id")
        const propertyId = $(this).attr("data-chip-btn-property-id")
        $(`#update-chip-div-${propertyId}-${tagId}`).attr("data-badge-div-matched", "0").hide()
    })

    $(".update-group-btn").click(function () {
        const propertyId = $(this).attr("data-update-group-btn-property-id")
        const value = document.getElementById(`updateInputDatalist-${propertyId}`).value
        document.getElementById(`updateInputDatalist-${propertyId}`).value = ""
        $(`.updateBadge-${propertyId}`).each(function () {
            const name = $(this).attr("data-badge-name")
            if (name == value) {
                const tagId = $(this).attr("data-badge-tag-id")
                $(`#updateBadgeDiv-${propertyId}-${tagId}`).attr("data-badge-div-matched", "1").show()
            }
        })
    })

    postTab({ context, entity, view }, tab, id, searchParams)

    $(".detailPanel").each(function () {
        const panel = $(this).attr("id")
        getPanel(tab, panel, id)
    })
}
