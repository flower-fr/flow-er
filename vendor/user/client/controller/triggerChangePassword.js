
const triggerChangePassword = async (rule) => {

    $(".fl-alert").hide()
    $(".fl-next-link").hide()

    const form = document.getElementById("flPasswordChangeForm")
    if (form) {
        form.onsubmit = async function (event) {
        
            event.preventDefault()

            $(".fl-alert").hide()

            // New password check

            if ($("#newPassword").val() !== $("#checkPassword").val()) {
                $("#newPassword").removeClass("is-valid").addClass("is-invalid")
                $("#checkPassword").removeClass("is-valid").addClass("is-invalid")
                $("#flAlertConsistency").show()
            }

            // Password strength

            else if (!rule.test($("#newPassword").val())) {
                $("#flAlertIntegrity").show()
            }

            else {

                $(".fl-submit").prop("disabled", true)

                // Create a new FormData object.
                const payload = {}
                payload.formJwt = $("#formJwt").val()
                payload.email = $("#email").val()
                payload.currentPassword = $("#currentPassword").val()
                payload.newPassword = $("#newPassword").val()

                const xhttp = await fetch("/user/change-password", {
                    method: "POST",
                    headers: new Headers({"content-type": "application/json"}),
                    body: JSON.stringify(payload)
                })

                if (xhttp.status == 403) {
                    $("#flAlertUnauthorized").show()
                    $(".fl-submit").prop("disabled", false)
                }

                else if (xhttp.status == 200) {
                    $("#flAlertOk").show()
                    $(".fl-submit").hide()
                    $(".form-outline").hide()
                    $(".fl-next-link").show()
                }
            }
        }
    }
}
