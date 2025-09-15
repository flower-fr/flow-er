/**
 * Formulaire de contact 
 */

const triggerPost = (recaptchaToken) => {

    return `
    $("#message").hide()
    const form = document.getElementById("contactForm")
    form.onsubmit = async function (event) {
        event.preventDefault()

        $("#contactFormButton").prop("disabled", true)

        /**
         * Recaptcha
         */
        let token
        if (${recaptchaToken}) token = await grecaptcha.enterprise.execute("${ recaptchaToken }", {action: 'LOGIN'})

        let body = {}
        body.n_first = $("#n_first").val()
        body.tel_cell = $("#tel_cell").val()
        body.email = $("#email").val()
        body.description = $("#description").val()
        body.gRecaptchaResponse = token

        const response = await fetch("", {
            method: "POST",
            headers: new Headers({"content-type": "application/json"}),
            body: JSON.stringify(body)
        })
        if (!response.ok) {
            switch (response.status) {
            case 500:
                $("#message").text("Serveur indisponible, veuillez ré-essayer ultérieurement.")
                return
            }
        }
        body = await response.json()
        if (body.status == "undelivrable") {
            $("#contactFormButton").prop("disabled", false)
            $("#message").show().text("Veuillez saisir un email valide et permanent.").removeClass("alert-success").addClass("alert-danger")
        }
        else $("#message").show().text("Votre demande est prise en compte, nous vous remercions.").removeClass("alert-danger").addClass("alert-success")
    }`
}

module.exports = {
    triggerPost
}