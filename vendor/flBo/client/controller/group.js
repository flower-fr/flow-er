import { getGroupTab } from "/flBo/cli/controller/getGroupTab.js"

const postGroupTab = async ({ context, entity, view }, tab, searchParams, rows) => {
    const form = document.getElementById("tabForm")
    if (form) {
        form.onsubmit = async function (event) {
        
            event.preventDefault()
            form.checkValidity()

            const submit = event.submitter

            /**
             * Add an attachment in the list
             */

            if ($(submit).attr("id") === "submitButton-document_binary") {
                // Special case for file upload outside of FormData
                const fileInput = document.getElementById("document_binary")
                if (fileInput.files.length === 0) {
                    alert(context.translate("Select a file to download"))
                    return
                }
                const fileSelect = document.getElementById("document_binary")
                if (fileSelect) {
                    const formData = new FormData(), files = fileSelect.files
                    formData.append("formJwt", $("#formJwt").val())
                    for (var i = 0; i < files.length; i++) {
                        const file = files[i]
                        if (file.size >= 1024000) {
                            alert(context.translate("File to big (1 Mb max)"))
                            return
                        }
                        formData.append("attachment", file, file.name)
                    }
                    const xhttp = await fetch("/core/file/document_binary", {
                        method: "POST",
                        body: formData
                    })
                    getGroupTab({ context, entity, view }, tab, searchParams)
                }
            }

            $(".fl-group-tab-submit").prop("disabled", true)

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

            $(".updateDatetime").each(function () {
                const propertyId = $(this).attr("id")
                payload[propertyId] = $(this).val().split(",").join("")
                formData.append(propertyId, $(this).val().split(",").join(""))
            })
            
            $(".updateSelect").each(function () {
                const propertyId = $(this).attr("id")
                if (propertyId) {
                    payload[propertyId] = $(this).val()
                    formData.append(propertyId, $(this).val())
                }
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
                formData.append(propertyId, $(this).children(".wysiwyg-content").html())
            })

            /**
             * Retrieve the properties related to checked rows
             */

            if (!rows) {
                rows = []
                $(".fl-list-check").each(function () {
                    if ($(this).prop("checked")) {
                        const checkData = $(this).attr("data-properties").split("|")
                        const row = {}
                        for (let pair of checkData) {
                            pair = pair.split(":")
                            row[pair[0]] = decodeURIComponent(pair[1])
                        }
                        rows.push({ ...row })
                    }
                })
            }

            const key = $(submit).attr("data-key"), keyInitialValue = $(submit).attr("data-key-initial-value"), keyCurrentValue = $(`#${ key }`).val()
            const dataId = $(submit).attr("data-id"), paramId = (dataId && key && keyInitialValue === keyCurrentValue) ? `/${ dataId }` : ""
            
            const route = `/${$(submit).attr("data-controller")}/${$(submit).attr("data-action")}/${$(submit).attr("data-entity")}/${$(submit).attr("data-transaction")}${ paramId }${ ($(submit).attr("data-view")) ? `?view=${ $(submit).attr("data-view") }` : "" }`

            const dataPayload = {}
            for (const [key, options] of Object.entries(JSON.parse(decodeURI($(submit).attr("data-payload"))))) {
                dataPayload[key] = (options.value) ? payload[options.value] : payload[key]
            }

            let xhttp
            if ($(submit).attr("data-action") === "file") {
                if (!dataId) formData.append("rows", JSON.stringify(rows))

                const fileSelect = document.getElementById("document_binary")
                if (fileSelect) {
                    const files = fileSelect.files
                    for (var i = 0; i < files.length; i++) {
                        const file = files[i]
                        if (file.size >= 1024000) {
                            alert(context.translate("File to big (1 Mb max)"))
                            return
                        }
                        formData.append("attachment", file, file.name)
                    }
                }

                xhttp = await fetch(route, {
                    method: "POST",
                    body: formData,
                })
            } else {
                const body = { payload: dataPayload }
                if (!dataId) body.rows = rows
                xhttp = await fetch(route, {
                    method: "POST",
                    headers: new Headers({"content-type": "application/json"}),
                    body: JSON.stringify(body)
                })
            }

            if (xhttp.status == 200) {
                $("#updateMessageOk").show()
                //getGroupTab({ context, entity, view }, tab, id, "ok", searchParams)
            }
            else if (xhttp.status == 401) getGroupTab({ context, entity, view }, tab, id, "expired", searchParams)
            else if (xhttp.status == 409) getGroupTab({ context, entity, view }, tab, id, xhttp.statusText, searchParams)
            else getGroupTab({ context, entity, view }, tab, searchParams)
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

    $("#flListDetailModalLabel").text(context.translate("Grouped actions"))
    $("#flListDetailModal").html(renderGroup({ context, entity, view}, data))

    $(".detailTab").click(function () {
        const tabId = $(this).attr("id").split("-")[1]
        $(".detailTab").removeClass("active")
        $(this).addClass("active")
        getGroupTab({ context, entity, view }, tabId, searchParams)
    })

    getGroupTab({ context, entity, view }, $("#defaultTab").val(), searchParams)
}

export { getGroup, postGroupTab }