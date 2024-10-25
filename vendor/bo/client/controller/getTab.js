
const getTab = async ({ context, entity, view }, tab, id, message, searchParams) => {

    let route = $(`#detailTabRoute-${tab}`).val()
    const xhttp = new XMLHttpRequest()

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
    const where = params.join("|")
    if (where) route += "&where=" + where

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

    $(".renderUpdate").each(function () { 
        const tabId = $(this).attr("id").split("-")[1]
        if (tabId == tab) {
            $("#detailPanel").html(renderDetailCards({ context, entity, view }, data))
            updateCallback({ context, entity, view }, data)
        }
    })
    $(".renderModalList").each(function () {
        const tabId = $(this).attr("id").split("-")[1]
        if (tabId == tab) {
            $("#detailPanel").html(renderModalList({ context, entity, view }, data)) 
            modalListCallback({ context, entity, view }, data)
            triggerModalList({ context, entity, view }, data)
        }
    })
    $(".renderModalCalendar").each(function () {
        const tabId = $(this).attr("id").split("-")[1]
        if (tabId == tab) {
            $("#detailPanel").html(renderModalCalendar({ context, entity, view }, tabId, data)) 
            modalCalendarCallback({ context, entity, view }, tabId, data)
        }
    })

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

    $(".submitSpinner").hide()
    
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
    
    $(".updateDate").datepicker()
    $(".updateDatetimeDate").datepicker()
    $(".updateTime").timepicker({ "timeFormat":"H:i:s", "step": 15, "scrollDefault": "now" })
    $(".updateDatetimeTime").timepicker({ "timeFormat":"H:i:s", "step": 15, "scrollDefault": "now" })
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