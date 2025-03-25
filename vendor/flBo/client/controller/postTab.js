
const postTab = async ({ context, entity, view }, tab, id, searchParams) => {
    const form = document.getElementById("tabForm")
    if (form) {
        form.onsubmit = async function (event) {
        
            event.preventDefault()
            form.checkValidity()

            const submit = event.submitter

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

                const route = `/${$(submit).attr("data-controller")}/${$(submit).attr("data-action")}/${$(submit).attr("data-entity")}/${$(submit).attr("data-transaction")}${ ($(submit).attr("data-id")) ? `/${ $(submit).attr("data-id") }` : "" }${ ($(submit).attr("data-view")) ? `?view=${ $(submit).attr("data-view") }` : "" }`
                console.log(route)
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
