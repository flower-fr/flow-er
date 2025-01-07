const triggerDetailTab = ({ context, entity, view }, data, tab, route, id, message, searchParams, order) => {

    /**
     * trigger links
     */

    $(".fl-modal-list-link").click(function() {
        const tabId = $(this).attr("data-fl-tab")
        const route = $(`#detailTabRoute-${tabId}`).val()
        getTab({ context, entity, view }, tabId, route, id, "", searchParams)
    })

    /**
     * trigger order
     */
    
    $(".fl-modal-list-order-button").click(function() {
        const propertyId = $(this).attr("data-fl-property")
        let direction = $(this).attr("data-fl-direction")
        if (!direction || direction == "-") direction = ""
        else direction = "-"
        getTab({ context, entity, view }, tab, route, id, message, searchParams, `${direction}${propertyId}`)
    })    

    $(".fl-modal-list-refresh-button").click(function() {
        const searchParams = getModalSearchParams()
        getTab({ context, entity, view }, tab, route, id, message, searchParams, order)
        
    })

    /**
     * trigger add
     */

    $(".fl-detail-tab-message").hide()
    $(".fl-submit-div").hide()
    $(".fl-modal-list-close-button").hide()
    $(".fl-modal-list-form").hide()

    $(".fl-modal-list-add-button").click(function () {
        //$(".fl-modal-list-row").hide()
        $(".fl-submit-div").show()
        $(".fl-modal-list-form").show()
        $(".fl-modal-list-add-button").removeClass("btn-primary").addClass("btn-outline-primary")
        $(".fl-modal-list-update-button").removeClass("btn-primary").addClass("btn-outline-primary")
        $(this).removeClass("btn-outline-primary").addClass("btn-primary")
        $(".fl-modal-list-close-button").show()
    })

    $(".fl-modal-list-update-button").click(function () {
        //$(".fl-modal-list-row").hide()
        $(".fl-submit-div").show()
        $(".fl-modal-list-form").show()
        $(".fl-modal-list-add-button").removeClass("btn-primary").addClass("btn-outline-primary")
        $(".fl-modal-list-update-button").removeClass("btn-primary").addClass("btn-outline-primary")
        $(this).removeClass("btn-outline-primary").addClass("btn-primary")
        $(".fl-modal-list-close-button").show()
    })

    $(".fl-modal-list-close-button").click(() => {
        //$(".fl-modal-list-row").show()
        $(".fl-submit-div").hide()
        $(".fl-modal-list-form").hide()
        $(".fl-modal-list-add-button").removeClass("btn-primary").addClass("btn-outline-primary")
        $(".fl-modal-list-update-button").removeClass("btn-primary").addClass("btn-outline-primary")
        $(".fl-modal-list-close-button").hide()
    })

    /**
     * trigger detail
     */

    $(".fl-modal-list-update-block").hide()

    flModalRules({ context })

    $(".fl-modal-list-detail-button").click(function () {
        getTab({ context, entity, view }, tab, $(this).attr("data-fl-route"), id, message, searchParams)
    })

    const form = document.getElementById("flModalForm")
    if (form) {
        form.onsubmit = async function (event) {
            event.preventDefault()
            $(".fl-detail-tab-submit").prop("disabled", true)
            const submit = event.submitter
            var validity = true

            if (validity) {

                $(".fl-modal-list-submit").prop("disabled", true)

                // Create a new FormData object.
                const payload = {}
                var formData = new FormData()
                payload.formJwt = $("#formJwt").val()
                formData.append("formJwt", $("#formJwt").val())

                $(".fl-modal-list-add-input").each(function () {
                    const propertyId = $(this).attr("id")
                    let value = $(this).val()
                    if ($(this).attr("data-fl-type") == "percentage") value /= 100
                    console.log(value)
                    payload[propertyId] = value
                    formData.append(propertyId, value)
                })

                $(".fl-modal-list-add-iban").each(function () {
                    const propertyId = $(this).attr("id")
                    payload[propertyId] = $(this).val()
                    formData.append(propertyId, $(this).val())
                })

                $(".fl-modal-list-add-email").each(function () {
                    const propertyId = $(this).attr("id")
                    payload[propertyId] = $(this).val()
                    formData.append(propertyId, $(this).val())
                })
                
                $(".fl-modal-list-add-phone").each(function () {
                    const propertyId = $(this).attr("id")
                    payload[propertyId] = $(this).val()
                    formData.append(propertyId, $(this).val())
                })

                $(".fl-modal-list-add-date").each(function () {
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

                $(".fl-modal-list-add-datetime-date").each(function () {
                    const propertyId = $(this).attr("id"), dateval = $(this).val(), timeval = $(`#fl-modal-list-add-DatetimeTime-${propertyId}`).val()
                    if (dateval) {
                        payload[propertyId] = `${dateval.substring(6, 10)}-${dateval.substring(3, 5)}-${dateval.substring(0, 2)} ${timeval}`
                        formData.append(propertyId, `${dateval.substring(6, 10)}-${dateval.substring(3, 5)}-${dateval.substring(0, 2)} ${timeval}`)
                    }
                    else {
                        payload[propertyId] = ""
                        formData.append(propertyId, "")
                    }
                })
                
                $(".fl-modal-list-add-birth-year").each(function () { 
                    const propertyId = $(this).attr("id")
                    payload[propertyId] = ($(this).val()) ? $(this).val() + "-01-01" : ""
                    formData.append(propertyId, ($(this).val()) ? $(this).val() + "-01-01" : "")
                })

                $(".fl-modal-list-add-number").each(function () {
                    const propertyId = $(this).attr("id")
                    let value = $(this).val().replace(",", ".")
                    if ($(this).attr("data-fl-type") == "percentage") value /= 100
                    payload[propertyId] = value
                    formData.append(propertyId, value)
                })

                $(".fl-modal-list-add-time").each(function () {
                    const propertyId = $(this).attr("id")
                    payload[propertyId] = $(this).val()
                    formData.append(propertyId, $(this).val())
                })
                
                $(".fl-modal-list-add-select").each(function () {
                    const propertyId = $(this).attr("id")
                    payload[propertyId] = $(this).val()
                    if (propertyId) formData.append(propertyId, $(this).val())
                })

                const tags = {}
                $(".fl-modal-list-add-badge-div").each(function () {
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
    
                $(".fl-modal-list-add-tags").each(function () {
                    const propertyId = $(this).attr("id")
                    payload[propertyId] = $(this).val()
                    formData.append(propertyId, $(this).val())
                })
                
                $(".fl-modal-list-add-textarea").each(function () {
                    const propertyId = $(this).attr("id")
                    payload[propertyId] = $(this).val()
                    formData.append(propertyId, $(this).val())
                })

                $(".fl-modal-list-add-check").each(function () {
                    const propertyId = $(this).attr("id")
                    payload[propertyId] = $(this).prop("checked") ? 1 : 0
                    formData.append(propertyId, $(this).prop("checked") ? 1 : 0)
                })
                
                $(".fl-modal-list-add-file").each(function () {
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

                let route = `/${$(submit).attr("data-fl-controller")}/${$(submit).attr("data-fl-action")}/${$(submit).attr("data-fl-entity")}`

                const response = await fetch(route, {
                    headers: {
                        "Content-Type": "application/json"
                    },
                    method: "POST",
                    body: JSON.stringify([payload])
                })

                if (response.status == 200) {
                    toastr.success(context.translate("Your request has been registered"))
                    $(".fl-modal-list-close-button").hide()
                    $("#flDetailTabMessageOk").show()
                    getTab({ context, entity, view }, tab, $(`#flDetailTabSubmitRefresh-${$(submit).attr("data-fl-transaction") }`).attr("data-fl-route"), id, message, searchParams)
                }
                else if (response.status == 401) triggerModalList({ context, entity, view }, route, "expired")
            }
            else return false
        }
    }
}