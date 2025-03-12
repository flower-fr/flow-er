
const postGlobal = async ({ context, entity, view }, data) => {
    const form = document.getElementById("globalForm")
    if (form) {
        form.onsubmit = async function (event) {
            event.preventDefault()
            var validity = true

            if (validity) {

                $(".fl-global-submit-button").prop("disabled", true)

                // Create a new FormData object.
                const payload = {}
                var formData = new FormData()
                payload.formJwt = $("#formJwt").val()
                formData.append("formJwt", $("#formJwt").val())

                $(".globalInput").each(function () {
                    const propertyId = $(this).attr("id")
                    payload[propertyId] = $(this).val()
                    formData.append(propertyId, $(this).val())
                })

                $(".globalIban").each(function () {
                    const propertyId = $(this).attr("id")
                    payload[propertyId] = $(this).val()
                    formData.append(propertyId, $(this).val())
                })

                $(".globalEmail").each(function () {
                    const propertyId = $(this).attr("id")
                    payload[propertyId] = $(this).val()
                    formData.append(propertyId, $(this).val())
                })
                
                $(".globalPhone").each(function () {
                    const propertyId = $(this).attr("id")
                    payload[propertyId] = $(this).val()
                    formData.append(propertyId, $(this).val())
                })

                $(".globalDate").each(function () {
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

                $(".globalDatetimeDate").each(function () {
                    const propertyId = $(this).attr("id"), dateval = $(this).val(), timeval = $(`#globalDatetimeTime-${propertyId}`).val()
                    if (dateval) {
                        payload[propertyId] = `${dateval.substring(6, 10)}-${dateval.substring(3, 5)}-${dateval.substring(0, 2)} ${timeval}`
                        formData.append(propertyId, `${dateval.substring(6, 10)}-${dateval.substring(3, 5)}-${dateval.substring(0, 2)} ${timeval}`)
                    }
                    else {
                        payload[propertyId] = ""
                        formData.append(propertyId, "")
                    }
                })
                
                $(".globalBirthYear").each(function () { 
                    const propertyId = $(this).attr("id")
                    payload[propertyId] = ($(this).val()) ? $(this).val() + "-01-01" : ""
                    formData.append(propertyId, ($(this).val()) ? $(this).val() + "-01-01" : "")
                })

                $(".globalNumber").each(function () {
                    const propertyId = $(this).attr("id")
                    const value = $(this).val().replace(",", ".")
                    payload[propertyId] = value
                    formData.append(propertyId, value)
                })

                $(".globalTime").each(function () {
                    const propertyId = $(this).attr("id")
                    payload[propertyId] = $(this).val()
                    formData.append(propertyId, $(this).val())
                })
                
                $(".globalSelect").each(function () {
                    const propertyId = $(this).attr("id")
                    payload[propertyId] = $(this).val()
                    if (propertyId) formData.append(propertyId, $(this).val())
                })

                const tags = {}
                $(".globalBadgeDiv").each(function () {
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
    
                $(".globalTags").each(function () {
                    const propertyId = $(this).attr("id")
                    payload[propertyId] = $(this).val()
                    formData.append(propertyId, $(this).val())
                })
                
                $(".globalTextarea").each(function () {
                    const propertyId = $(this).attr("id")
                    payload[propertyId] = $(this).val()
                    formData.append(propertyId, $(this).val())
                })

                $(".globalCheck").each(function () {
                    const propertyId = $(this).attr("id")
                    payload[propertyId] = $(this).prop("checked") ? 1 : 0
                    formData.append(propertyId, $(this).prop("checked") ? 1 : 0)
                })
                
                $(".globalFile").each(function () {
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

                let route = `/${data.post.controller}/${data.post.action}/${data.post.entity}/${data.post.id}`

                const response = await fetch(route, {
                    method: "POST",
                    body: formData
                })
                if (!response.ok) {
                    switch (response.status) {
                    case 401:
                        document.location("user/login")
                        return
                    case 500:
                        toastr.error("A technical error has occured. PLease try again later")
                        return
                    }
                }
            
                data = await response.json()
                const renderer = (data.layout && data.layout.renderer) ? { "renderGlobal": renderGlobal}[data.layout.renderer] : renderGlobal
                if (data.layout.title) $("#flGlobalModalLabel").text(context.localize(data.layout.title))
                $("#flGlobalModal").html(renderer({ context, entity, view }, data))
            
                $(".fl-global-message").hide()
                if (data.post) {
                    const form = document.getElementById("globalForm")
                    if (form) {
                        form.onsubmit = async function (event) {
                            event.preventDefault()
                            let route = `/${data.post.controller}/${data.post.action}/${data.post.entity}/${data.post.id}`
                            const response = await fetch(route, {
                                method: "POST",
                                //body: formData
                            })
                            if (!response.ok) {
                                switch (response.status) {
                                case 401:
                                    document.location("user/login")
                                    return
                                case 500:
                                    toastr.error("A technical error has occured. PLease try again later")
                                    return
                                }
                            }
                            $("#flGlobalMessageOk").show()
                            document.location = "#flGlobalMessageOk"
                            $(".fl-global-submit-button").hide()
                        }
                    }
                }
            }
            else return false
        }
    }
}
