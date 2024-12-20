const triggerModalList = ({ context, entity, view }, data, message) => {

    $(".fl-modal-list-message").hide()
    $(".fl-submit-div").hide()
    $(".fl-modal-list-close-button").hide()

    $(".fl-modal-list-add-button").click(() => {
        $(".fl-modal-list-row").hide()
        $(".fl-submit-div").show()
        $(".fl-modal-list-add-button").hide()
        $(".fl-modal-list-close-button").show()
    })

    $(".fl-modal-list-close-button").click(() => {
        $(".fl-modal-list-row").show()
        $(".fl-submit-div").hide()
        $(".fl-modal-list-close-button").hide()
        $(".fl-modal-list-add-button").show()
    })

    const form = document.getElementById("flModalListAddForm")
    if (form) {
        form.onsubmit = async function (event) {
            event.preventDefault()
            $("#flModalListAddSubmit").prop("disabled", true)
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
                    payload[propertyId] = $(this).val()
                    formData.append(propertyId, $(this).val())
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
                    const value = $(this).val().replace(",", ".")
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

                let route = `/${$(submit).attr("data-controller")}/${$(submit).attr("data-action")}/${$(submit).attr("data-entity")}`

                const response = await fetch(route, {
                    headers: {
                        "Content-Type": "application/json"
                    },
                    method: "POST",
                    body: JSON.stringify([payload])
                })

                if (response.status == 200) {
                    $(".fl-modal-list-close-button").hide()
                    $("#flModalListMessageOk").show()
                }
                else if (response.status == 401) triggerModalList({ context, entity, view }, route, "expired")
            }
            else return false
        }
    }
}