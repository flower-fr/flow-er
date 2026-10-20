
const triggerNewPassword = async (rule) => {

    $(".fl-alert").hide()

    const form = document.getElementById("flPasswordNewForm")
    if (form) {
        form.onsubmit = async function (event) {
        
            event.preventDefault()

            $(".fl-alert").hide()

            // New password check

            if ($("#newPassword").val() !== $("#checkPassword").val()) {
                $("#newPassword").removeClass("is-valid").addClass("is-invalid")
                $("#checkPassword").removeClass("is-valid").addClass("is-invalid")
                $("#flAlertConsistency").show()
                $("#newPassword").val("")
                $("#checkPassword").val("")
            }

            // Password strength

            else if (!rule.test($("#newPassword").val())) {
                $("#flAlertIntegrity").show()
                $("#newPassword").val("")
                $("#checkPassword").val("")
            }

            else {

                $(".fl-submit").prop("disabled", true)

                // Create a new FormData object.
                const payload = {
                    csrfToken: form.elements.csrfToken.value,
                    token: form.elements.token.value,
                    email: form.elements.email.value,
                    newPassword: form.elements.newPassword.value,
                }

                const xhttp = await fetch("/user/new-password", {
                    method: "POST",
                    headers: new Headers({"content-type": "application/json"}),
                    body: JSON.stringify(payload)
                })

                if (xhttp.status == 400 || xhttp.status == 410) {
                    window.location.reload()
                }

                else if (xhttp.status == 403) {
                    $("#flAlertUnauthorized").show()
                    $("#email").val("")
                    $("#newPassword").val("")
                    $("#checkPassword").val("")
                    $(".fl-submit").prop("disabled", false)
                }

                else if (xhttp.status == 401) {
                    $("#flAlertFormExpired").show()
                    $("#email").val("")
                    $("#newPassword").val("")
                    $("#checkPassword").val("")
                    $(".fl-submit").prop("disabled", false)
                }

                else if (xhttp.status == 200) {
                    $("#flAlertOk").show()
                    $(".fl-submit").hide()
                    $(".form-outline").hide()
                    $(".fl-next-link").show()
                }

                else if (xhttp.status == 422) {
                    $("#flAlertIntegrity").show()
                    $("#newPassword").val("")
                    $("#checkPassword").val("")
                    $(".fl-submit").prop("disabled", false)
                }

                else if (xhttp.status == 500) {
                    $("#flAlertServerError").show()
                    $(".fl-submit").hide()
                    $(".form-outline").hide()
                }
            }
        }
    }
}

const triggerResendLink = () => {
    const form = document.getElementById("flResendForm")
    if (!form) return

    form.onsubmit = async function (event) {
        event.preventDefault()
        $(".fl-resend-submit").prop("disabled", true)

        const res = await fetch("/user/resend-link", {
            method: "POST",
            headers: new Headers({ "content-type": "application/json" }),
            body: JSON.stringify({
                csrfToken: form.elements.csrfToken.value,
                email: form.elements.email.value
            })
        })

        if (res.status === 200) {
            await $(".alert").hide()
            $(".fl-resend-ok").show()
            $(".form-outline").hide()
            $(".fl-resend-submit").hide()
        } else {
            $("#flAlertFormExpired").show()
            $(".fl-resend-submit").prop("disabled", false)
        }
    }
}
