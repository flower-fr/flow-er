
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
                const payload = {}
                var formData = new FormData()
                payload.formJwt = $("#formJwt").val()
                formData.append("formJwt", $("#formJwt").val())
                payload.touched_at = $("#touched_at").val()
                formData.append("touched_at", $("#touched_at").val())

                $(".updateInput").each(function () {
                    const propertyId = $(this).attr("id")
                    payload[propertyId] = $(this).val()
                    formData.append(propertyId, $(this).val())
                })

                $(".updateIban").each(function () {
                    const propertyId = $(this).attr("id")
                    payload[propertyId] = $(this).val()
                    formData.append(propertyId, $(this).val())
                })

                $(".updateEmail").each(function () {
                    const propertyId = $(this).attr("id")
                    payload[propertyId] = $(this).val()
                    formData.append(propertyId, $(this).val())
                })
                
                $(".updatePhone").each(function () {
                    const propertyId = $(this).attr("id")
                    payload[propertyId] = $(this).val()
                    formData.append(propertyId, $(this).val())
                })

                $(".updateDate").each(function () {
                    const propertyId = $(this).attr("id"), val = $(this).val()
                    if (val) {
                        payload[propertyId] = val.substring(6, 10) + "-" + val.substring(3, 5) + "-" + val.substring(0, 2)
                        formData.append(propertyId, val.substring(6, 10) + "-" + val.substring(3, 5) + "-" + val.substring(0, 2))
                    }
                    else {
                        payload[propertyId] = ""
                        formData.append(propertyId, "")
                    }
                })

                $(".updateDatetimeDate").each(function () {
                    const propertyId = $(this).attr("id"), dateval = $(this).val(), timeval = $(`#updateDatetimeTime-${propertyId}`).val()
                    if (dateval) {
                        payload[propertyId] = `${dateval.substring(6, 10)}-${dateval.substring(3, 5)}-${dateval.substring(0, 2)} ${timeval}`
                        formData.append(propertyId, `${dateval.substring(6, 10)}-${dateval.substring(3, 5)}-${dateval.substring(0, 2)} ${timeval}`)
                    }
                    else {
                        payload[propertyId] = ""
                        formData.append(propertyId, "")
                    }
                })
                
                $(".updateBirthYear").each(function () { 
                    const propertyId = $(this).attr("id")
                    payload[propertyId] = ($(this).val()) ? $(this).val() + "-01-01" : ""
                    formData.append(propertyId, ($(this).val()) ? $(this).val() + "-01-01" : "")
                })

                $(".updateNumber").each(function () {
                    const propertyId = $(this).attr("id")
                    const value = $(this).val().replace(",", ".")
                    payload[propertyId] = value
                    formData.append(propertyId, value)
                })

                $(".updateTime").each(function () {
                    const propertyId = $(this).attr("id")
                    payload[propertyId] = $(this).val()
                    formData.append(propertyId, $(this).val())
                })
                
                $(".updateSelect").each(function () {
                    const propertyId = $(this).attr("id")
                    payload[propertyId] = $(this).val()
                    if (propertyId) formData.append(propertyId, $(this).val())
                })

                const tags = {}
                $(".updateBadgeDiv").each(function () {
                    const propertyId = $(this).attr("data-badge-div-property-id")
                    const tagId = $(this).attr("data-badge-div-tag-id")
                    const matched = parseInt($(this).attr("data-badge-div-matched"))
                    if (!tags[propertyId]) tags[propertyId] = []
                    if (matched) {
                        tags[propertyId].push(tagId) 
                    }
                })
                for (let tagId of Object.keys(tags)) {
                    payload[tagId] = tags[tagId]
                    formData.append(tagId, tags[tagId])
                }
    
                $(".updateTags").each(function () {
                    const propertyId = $(this).attr("id")
                    payload[propertyId] = $(this).val()
                    formData.append(propertyId, $(this).val())
                })
                
                $(".updateTextarea").each(function () {
                    const propertyId = $(this).attr("id")
                    payload[propertyId] = $(this).val()
                    formData.append(propertyId, $(this).val())
                })

                $(".updateCheck").each(function () {
                    const propertyId = $(this).attr("id")
                    payload[propertyId] = $(this).prop("checked") ? 1 : 0
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
                
                $(".wysiwyg").each(function () {
                    const propertyId = $(this).attr("id")
                    payload[propertyId] = $(this).children(".wysiwyg-content").html()
                    formData.append(propertyId, $(this).html())
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
                        payload[propertyId] = $("#" + propertyId).val()
                        formData.append(propertyId, $("#" + propertyId).val())
                        $("#" + propertyId + "_error").css("display", "none")
                    }
                })

                $(".user-update-check").each(function () {
                    let propertyId = $(this).attr("id"), checked = ($("#" + propertyId).prop("checked") ? 1: 0)
                    payload[propertyId] = checked
                    formData.append(propertyId, checked)
                })

                $(".user-update-select").each(function () {
                    let propertyId = $(this).attr("id"), val = $("#" + propertyId).val()
                    payload[propertyId] = $("#" + propertyId).val()
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
                        payload[propertyId] = $("#" + propertyId).val()
                        formData.append(propertyId, $("#" + propertyId).val())
                        $("#" + propertyId + "_error").css("display", "none")
                    }
                })

                let route = $(`#detailTabRoute-${tab}`).val()

                const xhttp = await fetch(route, {
                    method: "POST",
                    headers: new Headers({"content-type": "application/json"}),
                    body: JSON.stringify(payload)
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

const getDetail = (context, entity, view, id, searchParams) => {
    
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
                $("#flListDetailModal").html(renderDetail({ context, entity, view}, data))

                $(".detailTab").click(function () {
                    const tabId = $(this).attr("id").split("-")[1]
                    $(".detailTab").removeClass("active")
                    $(this).addClass("active")
                    const route = $(`#detailTabRoute-${tabId}`).val()
                    getTab({ context, entity, view }, tabId, route, id, "", searchParams)
                })

                const tab = $("#defaultTab").val(), route = $(`#detailTabRoute-${tab}`).val()
                getTab({ context, entity, view }, tab, route, id, "", searchParams)
            }
            else toastr.error("A technical error has occured. PLease try again later")
        }
    }
    xhttp.send()
}
