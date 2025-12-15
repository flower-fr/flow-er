import { getDetail } from "/flBo/cli/controller/triggerDetail.js"
import { getTab } from "/flBo/cli/controller/getTab.js"
import { flModalRules } from "/flBo/cli/controller/modalRules.js"

const triggerDetailTab = ({ context, entity, view }, data, tab, route, id, message, searchParams, order, callback) => {

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

    $(".fl-modal-list-search-refresh").click(() => {
        const searchParams = {}
        $(".fl-modal-list-search-input").each(function () {
            const value = $(this).val()
            if (value) searchParams[$(this).attr("data-fl-property")] = `contains,${$(this).val()}`
        })
        $(".fl-modal-list-search-date-min").each(function () {
            const date = $(this).val()
            if (date) searchParams[$(this).attr("data-fl-property")] = ["ge", `${date.substring(6,10)}-${date.substring(3,5)}-${date.substring(0,2)}`]
        })
        $(".fl-modal-list-search-date-max").each(function () {
            const propertyId = $(this).attr("data-fl-property"), date = $(this).val(), formatted = `${date.substring(6,10)}-${date.substring(3,5)}-${date.substring(0,2)}`
            if (date) {
                const value = (searchParams[propertyId]) ? [searchParams[propertyId][1], formatted] : [formatted]
                searchParams[propertyId] = value    
            }
        })
        getTab({ context, entity, view }, tab, route, id, message, searchParams, order)
    })

    /**
     * trigger add
     */

    $(".fl-detail-tab-message").hide()
    if (message == "ok") {
        $("#flDetailTabMessageOk").show()
        document.location = "#flDetailTabMessageOk"
    }

    $(".fl-modal-list-add-button").each(function () {
        $(".fl-submit-div").hide()
        $(".fl-modal-list-close-button").hide()
        $(".fl-modal-list-form").hide()
    })

    $(".fl-modal-list-update-button").each(function () {
        $(".fl-submit-div").hide()
        $(".fl-modal-list-close-button").hide()
        $(".fl-modal-list-form").hide()
    })

    $(".fl-modal-list-add-button").click(function () {
        //$(".fl-modal-list-row").hide()
        $(".fl-submit-div").show()
        $(".fl-modal-list-form").show()
        $(".fl-modal-list-add-input").each(function () {
            if ($(this).prop("type") !== "hidden") $(this).val("")
        })
        $(".fl-modal-list-add-select").val("")
        $(".fl-modal-list-add-date").val("")
        $(".fl-modal-list-add-email").val("")
        $(".fl-modal-list-add-phone").val("")
        $("#id").val("0")

        // Deprecated
        $(".fl-modal-list-add-button").removeClass("btn-primary").addClass("btn-outline-primary")
        $(".fl-modal-list-add-button").prop("disabled", false)
        $(".fl-modal-list-update-button").removeClass("btn-primary").addClass("btn-outline-primary")
        $(".fl-modal-list-update-button").prop("disabled", false)
        $(this).removeClass("btn-outline-primary").addClass("btn-primary")
        $(this).prop("disabled", true)

        $(".fl-modal-list-add-button").hide()
        $(".fl-modal-list-close-button").show()
    })

    $(".fl-modal-list-update-button").click(function () {
        //$(".fl-modal-list-row").hide()
        $(".fl-submit-div").show()
        $(".fl-modal-list-form").show()
        const data = JSON.parse(decodeURI($(this).attr("data-fl-data")))
        for (const [key, value] of Object.entries(data)) {
            $(`#${key}`).val(value)
            $(`#${key}`).focus()
        }

        $(".fl-modal-list-add-button").removeClass("btn-primary").addClass("btn-outline-primary")
        $(".fl-modal-list-add-button").prop("disabled", false)
        $(".fl-modal-list-update-button").removeClass("btn-primary").addClass("btn-outline-primary")
        $(".fl-modal-list-update-button").prop("disabled", false)
        $(this).removeClass("btn-outline-primary").addClass("btn-primary")
        $(this).prop("disabled", true)
        $(".fl-modal-list-close-button").show()
    })

    $(".fl-modal-list-close-button").click(() => {
        //$(".fl-modal-list-row").show()
        $(".fl-submit-div").hide()
        $(".fl-modal-list-form").hide()

        // Deprecated
        $(".fl-modal-list-add-button").removeClass("btn-primary").addClass("btn-outline-primary")
        $(".fl-modal-list-add-button").prop("disabled", false)
        $(".fl-modal-list-update-button").removeClass("btn-primary").addClass("btn-outline-primary")
        $(".fl-modal-list-update-button").prop("disabled", false)

        $(".fl-modal-list-add-button").show()
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

    $(".fl-update-button").each(() => {
        if (id != 0) {
            $(".fl-submit-div").hide()
            $(".fl-modal-form-input").prop("disabled", true)
        }
        else  $(".fl-update-button").hide()
        $(".fl-close-button").hide()
    })

    $(".fl-modal-form-input").prop("disabled", "disabled")

    $(".fl-update-button").click(function() {
        $(".fl-submit-div").show()
        $(".fl-close-button").show()
        $(".fl-update-button").hide()
        $(".fl-modal-form-input").prop("disabled", false)
    })

    $(".fl-close-button").click(() => {
        $(".fl-submit-div").hide()
        $(".fl-close-button").hide()
        $(".fl-update-button").show()
        $(".fl-modal-form-input").prop("disabled", true)
        $(".fl-detail-tab-message").hide()
        $(".fl-modal-form-input").prop("disabled", "disabled")
    })

    $(".fl-detail-tab-action").click(async function () {
        let route = `/${$(this).attr("data-fl-controller")}/${$(this).attr("data-fl-action")}/${$(this).attr("data-fl-entity")}`
        if ($(this).attr("data-fl-id")) route += `/${ $(this).attr("data-fl-id") }`
        if ($(this).attr("data-fl-view")) route += `?view=${ $(this).attr("data-fl-view") }`

        const response = await fetch(route, {
            headers: {
                "Content-Type": "application/json"
            },
            method: $(this).attr("data-fl-method") || "POST"
        })

        if (response.status == 200) {
            getTab({ context, entity, view }, tab, null, id, "ok", searchParams)
        }
    })

    const form = document.getElementById("flModalForm")
    if (form) {
        form.onsubmit = async function (event) {
            event.preventDefault()
            const submit = event.submitter

            if ($(submit).attr("data-fl-danger") === "danger") {
                $(submit).attr("data-fl-danger", "")
                $(submit).removeClass("btn-outline-primary").addClass("btn-danger")
                return
            }

            $(".fl-detail-tab-submit").prop("disabled", true)
            $(".fl-modal-list-submit").prop("disabled", true)

            // Create a new FormData object.
            const payload = {}
            var formData = new FormData()
            payload.formJwt = $("#formJwt").val()

            $(".fl-modal-form-input").each(function () {
                if ($(this).attr("data-fl-disabled") != "disabled") {
                    const propertyId = $(this).attr("data-fl-property"), type = $(this).attr("data-fl-type")
                    let value = $(this).val()

                    if (type == "percentage") value /= 100

                    else if (type == "date") {
                        if (value) {
                            value = value.substring(6, 10) + "-" + value.substring(3, 5) + "-" + value.substring(0, 2)
                        }
                    }

                    else if (type == "time") {
                        if (value) {
                            let h = value.substring(0, 2), m = value.substring(3, 5)
                            if (value.substring(6, 8) == "PM") h = (parseInt(h) + 12).toString()
                            value = `${h}:${m}:00`
                        }
                    }

                    else if (type == "birthYear") value += "-01-01"

                    else if (type == "number") value = value.replace(",", ".")

                    payload[propertyId] = value
                }
            })
            
            $(".fl-modal-form-file").each(function () {
                if ($(this).attr("data-fl-disabled") != "disabled") {
                    const propertyId = $(this).attr("data-fl-property")
                    const fileSelect = document.getElementById(propertyId)
                    if (fileSelect) {
                        var files = fileSelect.files
                        for (var i = 0; i < files.length; i++) {
                            var file = files[i]
                            formData.append(propertyId, file, file.name)
                        }
                    }
                }
            })

            $(".fl-modal-list-add-input").each(function () {
                const propertyId = $(this).attr("id")
                let value = $(this).val()
                if ($(this).attr("data-fl-type") == "percentage") value /= 100
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
            if ($(submit).attr("data-fl-id")) route += `/${ $(submit).attr("data-fl-id") }`
            if ($(submit).attr("data-fl-view")) route += `?view=${ $(submit).attr("data-fl-view") }`

            const response = await fetch(route, {
                headers: {
                    "Content-Type": "application/json"
                },
                method: $(submit).attr("data-fl-method") || "POST",
                body: JSON.stringify([payload])
            })

            // const route = `/${$(submit).attr("data-fl-controller")}/file/${$(submit).attr("data-fl-entity")}`

            // for (const [key, value] of Object.entries(payload)) formData.append(key, value)
            // const response = await fetch(route, {
            //     method: "POST",
            //     body: formData
            // })

            if (response.status == 200) {
                $(".fl-modal-list-close-button").hide()
                $("#flDetailTabMessageOk").show()

                const body = await response.json()

                if (callback) {
                    const id = body.stored[0].entitiesToInsert[entity].rowId
                    const detailRoute = (callback.controller) ? `/${ callback.controller }/${ callback.action }/${ callback.entity }/${ id }` : `${ callback.detailRoute }/${ id }?view=${ callback.view }`
                    getDetail(context, entity, view, detailRoute, id, callback.searchParams)
                }
                else {
                    getTab({ context, entity, view }, tab, null, id, "ok", searchParams)
                }
            }
            else if (response.status == 401) triggerDetailTab = ({ context, entity, view }, data, tab, route, id, "expired", searchParams, order)
        }
    }
}

export { triggerDetailTab }