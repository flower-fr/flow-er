

const postGroupTab = async ({ context, entity, view }, tab, searchParams) => {
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
                for (let tagId of Object.keys(tags)) formData.append(tagId, tags[tagId])
    
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

                let route = $(`#detailTabRoute-${tab}`).val()

                const xhttp = await fetch(route, {
                    method: "POST",
                    body: formData
                })

                if (xhttp.status == 200) {
                    getGroupTab({ context, entity, view }, tab, id, "ok", searchParams)
                }
                else if (xhttp.status == 401) getGroupTab({ context, entity, view }, tab, id, "expired", searchParams)
                else if (xhttp.status == 409) getGroupTab({ context, entity, view }, tab, id, xhttp.statusText, searchParams)
                else getGroupTab({ context, entity, view }, tab, id, "serverError", searchParams)
            }
            else return false
        }
    }
}

const getGroup = async (context, entity, view, searchParams) => {

    var route = `${$("#groupRoute").val()}?view=${view}`

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

    $("#listDetailModalLabel").text(context.translate("Grouped actions"))
    $(".modal-body").html("")
    $("#listDetailModal").html(renderGroup({ context, entity, view}, data))

    $(".detailTab").click(function () {
        const tabId = $(this).attr("id").split("-")[1]
        $(".detailTab").removeClass("active")
        $(this).addClass("active")
        getGroupTab({ context, entity, view }, tabId, searchParams)
    })

    getGroupTab({ context, entity, view }, $("#defaultTab").val(), searchParams)
}
