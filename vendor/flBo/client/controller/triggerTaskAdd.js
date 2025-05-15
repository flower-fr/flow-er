
const triggerTaskAdd = ({ context, entity, view }, searchParams, message) => {

    $(".fl-task-add").click(function () {
        getTaskAdd({ context, entity, view }, searchParams)
    })
}

const getTaskAdd = async ({ context, entity, view }, searchParams) => {

    const route = `/flBo/detailTab/${entity}/0?view=${view}`

    const response = await fetch(route)
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

    const data = await response.json()

    $("#flModalContent").html(renderTaskAdd({ context, entity, view}, { properties: data.data[entity].properties } ))
    tasksCallback({ context, entity, view })

    $(".fl-modal-message").hide()

    const form = document.getElementById("flModalForm")
    if (form) {
        form.onsubmit = async function (event) {
            event.preventDefault()
            $(".fl-task-submit").prop("disabled", true)
            const submit = event.submitter

            const payload = { "owner_id": context.user.profile_id }
            payload.formJwt = $("#formJwt").val()
            payload.touched_at = $("#touched_at").val()

            $(".fl-modal-form-input").each(function () {
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

                let values = $(this).attr("data-fl-values"), ids = $(this).attr("data-fl-ids")
                if (values) {
                    values = values.split(",")
                    ids = ids.split(",")
                    for (let i=0; i < values.length; i++) {
                        console.log(values[i], value)
                        if (values[i] == value) {
                            value = ids[i]
                            break
                        }
                    }
                }

                payload[propertyId] = value
            })

            $(".fl-modal-form-check").each(function () {
                const propertyId = $(this).attr("data-fl-property")
                if ($(this).prop("checked")) payload[propertyId] = $(this).value()
            })

            const route = `/${$(submit).attr("data-fl-controller")}/${$(submit).attr("data-fl-action")}/${$(submit).attr("data-fl-entity")}`

            const response = await fetch(route, {
                headers: {
                    "Content-Type": "application/json"
                },
                method: "POST",
                body: JSON.stringify([payload])
            })

            if (response.status == 200) {
                const myModalEl = document.getElementById("flModal")
                const modal = mdb.Modal.getInstance(myModalEl)
                modal.toggle()
                //$("#flModalMessageOk").show()
            }
            else if (response.status == 401) triggerTaskAdd({ context, entity, view }, searchParams, "expired")
        }
    }
}

export { triggerTaskAdd }