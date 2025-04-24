const getList = async ({ entity }) => {		

    const response = await fetch(`/flBo/list/${ entity }`)
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

    return await response.json()
}

const postList = async ({ entity }) =>
{
    const form = document.getElementById("flJsonForm")
    if (form) {
        form.onsubmit = async function (event) {

            event.preventDefault()
            const submit = event.submitter

            $(".fl-json-submit").prop("disabled", true)

            const body = {}
            body["formJwt"] = $("#formJwt").val()
            const formData = new FormData()
            formData.append("formJwt", $("#formJwt").val())

            $(".fl-json-input").each(function () {

                const propertyId = $(this).attr("data-fl-property"), type = $(this).attr("data-fl-type")
                let value = $(this).val()

                if (type === "select" && $(this).prop("multiple")) value = value.join(",")

                else if (type === "percentage") value /= 100

                else if (type === "date") {
                    if (value) {
                        value = value.substring(6, 10) + "-" + value.substring(3, 5) + "-" + value.substring(0, 2)
                    }
                }

                else if (type === "time") {
                    if (value) {
                        let h = value.substring(0, 2), m = value.substring(3, 5)
                        if (value.substring(6, 8) == "PM") h = (parseInt(h) + 12).toString()
                        value = `${h}:${m}:00`
                    }
                }

                else if (type === "number") value = value.replace(",", ".")

                body[propertyId] = value
                formData.append(propertyId, value)
            })

            let route = `/studio/notifRules/${ entity }`

            const response = await fetch(route, {
                method: "POST",
                body: formData
                // headers: new Headers({"content-type": "application/json"}),
                // body: JSON.stringify(body)
            })

            if (response.status == 200) {
                $(".fl-json-close-button").hide()
                $(".fl-json-message-div").show()
            }
        }
    }
}

const deleteList = async ({ entity }) =>
{
    $(".fl-json-submit").prop("disabled", true)

    const body = {}
    body["formJwt"] = $("#formJwt").val()
    body["visibility"] = "deleted"
    body["id"] = $("#id").val()

    let route = `/studio/notifRules/${ entity }`

    const response = await fetch(route, {
        method: "POST",
        headers: new Headers({"content-type": "application/json"}),
        body: JSON.stringify(body)
    })

    if (response.status == 200) {
        $(".fl-json-close-button").hide()
        $(".fl-json-message-div").show()
    }
}
    
const triggerList = ({ entity }, create, initSelect, dispose) => {

    $(".fl-json-form").hide()
    $(".fl-json-message-div").hide()
    $(".fl-json-submit-div").hide()
    $(".fl-json-close-button").hide()

    $(".fl-json-add-button").click(() => {
        $(".fl-json-form").show()
        create()
        $(".fl-json-row").hide()
        $(".fl-json-submit-div").show()
        $(".fl-json-add-button").hide()
        $(".fl-json-close-button").show()
        $(".fl-json-submit").hide()
        $(".fl-json-add").show()
    })

    $(".fl-json-detail-button").click(function () {
        $(".fl-json-form").show()
        create()
        const rowId = $(this).attr("data-fl-row")
        $(`.fl-json-cell-${ rowId }`).each(function () {
            const propertyId = $(this).attr("data-fl-property"), value = $(this).attr("data-fl-value")
            if ($(`#${ propertyId }`).attr("data-fl-type") === "select") {
                initSelect(document.getElementById(propertyId), value)
            }
            else $(`#${ propertyId }`).val(value)
        })
        document.querySelectorAll('.form-outline').forEach((formOutline) => {
            new mdb.Input(formOutline).init()
        })
        $(".fl-json-row").hide()
        $(".fl-json-submit-div").show()
        $(".fl-json-add-button").hide()
        $(".fl-json-close-button").show()
        $(".fl-json-submit").hide()
        $(".fl-json-update").show()
        $(".fl-json-delete").show()
    })

    $(".fl-json-delete").click(() => {
        $(".fl-json-delete").removeClass("btn-outline-primary").addClass("btn-danger")
        $(".fl-json-delete").click(() => {
            deleteList({ entity })
        })
    })

    $(".fl-json-close-button").click(() => {
        $(".fl-json-form").hide()
        $(".fl-json-row").show()
        $(".fl-json-submit").hide()
        $(".fl-json-submit-div").hide()
        $(".fl-json-close-button").hide()
        $(".fl-json-add-button").show()
        $(".fl-json-input").each(function () {
            if ($(this).attr("data-fl-type") === "select") {
                initSelect($(this), null)
            }
            else $(this).val("")
        })
        document.querySelectorAll('.form-outline').forEach((formOutline) => {
            new mdb.Input(formOutline).init()
        })
        dispose()
    })

    postList({ entity })
}

export { getList, triggerList }