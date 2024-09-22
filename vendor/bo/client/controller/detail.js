
function getHistory(propertyId) {
    const xhttp = new XMLHttpRequest()
    const route = $("#updateHistoryRoute-" + propertyId).val()
    xhttp.open("GET", route, true)
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4) {
            if (xhttp.status == 200) {

                $("#updateHistory-" + propertyId).html(xhttp.responseText)
            }
            else toastr.error("A technical error has occured. PLease try again later")
        }
    }
    xhttp.send()
}

const getSelect = (propertyId) => {
    const xhttp = new XMLHttpRequest()
    const route = $("#updateSelectRoute-" + propertyId).val()
    xhttp.open("GET", route, true)
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4) {
            if (xhttp.status == 401) {
                $(".modal-body").html("")
                $("#listDetailModalForm").modal("hide")
                getLogin(loadPage)
            }
            else if (xhttp.status == 200) {

                if (xhttp.statusText.substring(0, 3) == "jwt") {
                    document.cookie = `JWT-${$("#instanceCaption").val()}${xhttp.statusText.substring(4)};path=/`
                }

                $("#updateSelectDiv-" + propertyId).html(xhttp.responseText)
                //$(".updateSelectpicker-" + propertyId).selectpicker()
                if (propertyId == "place_id") $(`#${propertyId}`).change(function () { selectDynamic("owner_id", "") })
            }
            else toastr.error("A technical error has occured. PLease try again later")
        }
    }
    xhttp.send()
}

const postTab = async ({ context, entity, view }, tab, id, searchParams) => {
    const form = document.getElementById("tabForm")
    if (form) {
        form.onsubmit = async function (event) {
        
            event.preventDefault()
            form.checkValidity()
            var validity = true

            // IBAN check
            $(".inputIban").each( function () {
                const iban = $(this).val()
                if (iban && controleIBAN($(".inputIban").val()) != 0) validity = false 
            })

            if (validity) {

                $(".submitDiv").hide()
                $(".submitSpinner").show()

                // Create a new FormData object.
                var formData = new FormData()
                formData.append("formJwt", $("#formJwt").val())
                formData.append("touched_at", $("#touched_at").val())

                $(".updateInput").each(function () {
                    const propertyId = $(this).attr("id")
                    formData.append(propertyId, $(this).val())
                })

                $(".updateIban").each(function () {
                    const propertyId = $(this).attr("id")
                    formData.append(propertyId, $(this).val())
                })

                $(".updateEmail").each(function () {
                    const propertyId = $(this).attr("id")
                    formData.append(propertyId, $(this).val())
                })
                
                $(".updatePhone").each(function () {
                    const propertyId = $(this).attr("id")
                    formData.append(propertyId, $(this).val())
                })

                $(".updateDate").each(function () {
                    const propertyId = $(this).attr("id"), val = $(this).val()
                    if (val) formData.append(propertyId, val.substring(6, 10) + "-" + val.substring(3, 5) + "-" + val.substring(0, 2))
                    else formData.append(propertyId, "")
                })

                $(".updateDatetimeDate").each(function () {
                    const propertyId = $(this).attr("id"), dateval = $(this).val(), timeval = $(`#updateDatetimeTime-${propertyId}`).val()
                    if (dateval) formData.append(propertyId, `${dateval.substring(6, 10)}-${dateval.substring(3, 5)}-${dateval.substring(0, 2)} ${timeval}`)
                    else formData.append(propertyId, "")
                })
                
                $(".updateBirthYear").each(function () { 
                    const propertyId = $(this).attr("id")
                    formData.append(propertyId, ($(this).val()) ? $(this).val() + "-01-01" : "")
                })

                $(".updateNumber").each(function () {
                    const propertyId = $(this).attr("id")
                    const value = $(this).val().replace(",", ".")
                    formData.append(propertyId, value)
                })

                $(".updateTime").each(function () {
                    const propertyId = $(this).attr("id")
                    formData.append(propertyId, $(this).val())
                })
                
                $(".updateSelect").each(function () {
                    const propertyId = $(this).attr("id")
                    if (propertyId) formData.append(propertyId, $(this).val())
                })

                $(".updateTags").each(function () {
                    const propertyId = $(this).attr("id")
                    formData.append(propertyId, $(this).val())
                })
                
                $(".updateTextarea").each(function () {
                    const propertyId = $(this).attr("id")
                    formData.append(propertyId, $(this).val())
                })

                $(".updateCheck").each(function () {
                    const propertyId = $(this).attr("id")
                    formData.append(propertyId, $(this).prop("checked") ? 1 : 0)
                })
                
                $(".updateFile").each(function () {
                    const propertyId = $(this).attr("id")
                    const fileSelect = document.getElementById(propertyId)
                    if (fileSelect) {
                        var files = fileSelect.files
                        for (var i = 0; i < files.length; i++) {
                            var file = files[i]
                            formData.append(propertyId, file, file.name)
                        }
                    }
                })

                $(".user-update-input").each(function (e) {
                    let propertyId = $(this).attr("id"), val = $("#" + propertyId).val()
                    if (val.length > 255) {
                        $("#" + propertyId + "_group").addClass("has-error")
                        $("#" + propertyId + "_error").html("The input is too long")
                        $("#" + propertyId + "_error").css("display", "block")
                        $("#" + propertyId).focus()
                        validity = false
                    }
                    else {
                        formData.append(propertyId, $("#" + propertyId).val())
                        $("#" + propertyId + "_error").css("display", "none")
                    }
                })

                $(".user-update-check").each(function () {
                    let propertyId = $(this).attr("id"), checked = ($("#" + propertyId).prop("checked") ? 1: 0)
                    formData.append(propertyId, checked)
                })

                $(".user-update-select").each(function () {
                    let propertyId = $(this).attr("id"), val = $("#" + propertyId).val()
                    formData.append(propertyId, $("#" + propertyId).val())
                })

                $(".user-update-textarea").each(function () {
                    let propertyId = $(this).attr("id"), val = $("#" + propertyId).val()
                    if (val.length > 65535) {
                        $("#" + propertyId + "_group").addClass("has-error")
                        $("#" + propertyId + "_error").html("The input is too long")
                        $("#" + propertyId + "_error").css("display", "block")
                        $("#" + propertyId).focus()
                        validity = false
                    }
                    else {
                        formData.append(propertyId, $("#" + propertyId).val())
                        $("#" + propertyId + "_error").css("display", "none")
                    }
                })

                let route = $(`#detailTabRoute-${tab}`).val()

                const xhttp = await fetch(route, {
                    method: "POST",
                    body: formData
                })

                if (xhttp.status == 200) {

                    if (xhttp.statusText.substring(0, 3) == "jwt") {
                        document.cookie = `JWT-${$("#instanceCaption").val()}${xhttp.statusText.substring(4)};path=/`
                    }

                    if (id == 0) id = xhttp.body
                    getTab({ context, entity, view }, tab, id, "ok", searchParams)
                }
                else if (xhttp.status == 401) getTab({ context, entity, view }, tab, id, "expired", searchParams)
                else if (xhttp.status == 409) getTab({ context, entity, view }, tab, id, xhttp.statusText, searchParams)
                else getTab({ context, entity, view }, tab, id, "serverError", searchParams)
            }
            else return false
        }
    }
}

const submitDelete = ({ context, entity, view }, id) => {
    const formData = new FormData()
    formData.append("formJwt", $("#formJwt").val())
    formData.append("touched_at", $("#touched_at").val())

    const xhttp = new XMLHttpRequest()
    const route = $(`#deleteRoute-${id}`).val()
    xhttp.open("POST", route, true)
    xhttp.onload = function () {
        if (xhttp.readyState == 4) {
            if (xhttp.status == 200) {

                if (xhttp.statusText.substring(0, 3) == "jwt") {
                    document.cookie = `JWT-${$("#instanceCaption").val()}${xhttp.statusText.substring(4)};path=/`
                }

                $(".modal-body").html("")
                $("#listDetailModalForm").modal("hide")
            }
            else if (xhttp.status == 401) getTab({ context, entity, view }, tab, id, "expired", searchParams)
            else if (xhttp.status == 409) getTab({ context, entity, view }, tab, id, "consistency", searchParams)
            else getTab(tab, id, "serverError")
        }
    }
    xhttp.send(formData)
}

const getTab = ({ context, entity, view }, tab, id, message, searchParams) => {

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

    xhttp.open("GET", route, true)
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4) {
            if (xhttp.status == 401) {
                getLogin(loadPage)
            }
            else if (xhttp.status == 200) {

                if (xhttp.statusText.substring(0, 3) == "jwt") {
                    document.cookie = `JWT-${$("#instanceCaption").val()}${xhttp.statusText.substring(4)};path=/`
                }

                const data = JSON.parse(xhttp.responseText)
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

                postTab({ context, entity, view }, tab, id, searchParams)

                $(".detailPanel").each(function () {
                    const panel = $(this).attr("id")
                    getPanel(tab, panel, id)
                })
            }
            else toastr.error("A technical error has occured. PLease try again later")
        }
    }
    xhttp.send()
}

const getDetail = (context, entity, view, id, searchParams) => {
    
    $(".modal-body").unbind()

    var ListForeignKeyProperty = []
    $("input.foreignKeyProperty-"+id).each(function(i){
        var key = $(this).attr("id").split("-")[1]
        var value = $(this).val()
        ListForeignKeyProperty.push(`${key}:${value}`)
    })
    let queryForeignKeyProperty = ""
    if(ListForeignKeyProperty.length > 0){
        queryForeignKeyProperty = "foreign_key_property="+ListForeignKeyProperty.join("|")+"&"
    }

    var xhttp = new XMLHttpRequest()
    var route = `${$("#detailRoute").val()}/${id}?view=${view}`

    const checkIds = []
    $(`.listCheckId-${id}`).each(function () {
        const propertyId = $(this).attr("id").split("-")[2], value = $(this).val()
        checkIds.push(`${propertyId}:${value}`)
    })
    route += `&ids=${checkIds.join("|")}`

    xhttp.open("GET", route, true)
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4) {
            if (xhttp.status == 401) {
                $(".modal-body").html("")
                $("#listDetailModalForm").modal("hide")
                getLogin(loadPage)
            }
            else if (xhttp.status == 200) {

                if (xhttp.statusText.substring(0, 3) == "jwt") {
                    document.cookie = `JWT-${$("#instanceCaption").val()}${xhttp.statusText.substring(4)};path=/`
                }

                if (id != 0) {
                    const n_fn = $("#detailCaption-" + id).val()
                    $("#listDetailModalLabel").text(n_fn)
                }
                else $("#listDetailModalLabel").text(context.translate("Add"))

                $(".updateBirthYear").unbind()
                $(".updateDate").unbind()
                $(".updateEmail").unbind()
                $(".updateFile").unbind()
                $(".updateNumber").unbind()
                $(".updatePhone").unbind()
                $(".updateSelect").unbind()
                $(".updateTexArea").unbind()
                $(".updateTime").unbind()

                $(".modal-body").html("")
                const data = JSON.parse(xhttp.responseText)
                $("#listDetailModal").html(renderDetail({ context, entity, view}, data))

                $(".detailTab").click(function () {
                    const tabId = $(this).attr("id").split("-")[1]
                    $(".detailTab").removeClass("active")
                    $(this).addClass("active")
                    getTab({ context, entity, view }, tabId, id, "", searchParams)
                })

                getTab({ context, entity, view }, $("#defaultTab").val(), id, "", searchParams)
            }
            else toastr.error("A technical error has occured. PLease try again later")
        }
    }
    xhttp.send()
}
