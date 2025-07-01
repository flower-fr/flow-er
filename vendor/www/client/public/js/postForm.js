/**
 * Formulaire de contact 
 */

const [recaptchaToken] = Object.values(JSON.parse(decodeURI(document.getElementById("module-script").dataset.json)))

const postForm = async ({recaptchaToken}) => {
    console.log(recaptchaToken)
    const form = document.getElementById("contactForm")
    form.onsubmit = async function (event) {
        event.preventDefault()

        $("#contactFormButton").prop("disabled", true)

        /**
         * Recaptcha
         */
        const token = await grecaptcha.enterprise.execute(recaptchaToken, {action: 'LOGIN'})

        var body = {}
        body.n_first = $("#n_first").val()
        body.email = $("#email").val()
        body.text = $("#text").val()
        body["g-recaptcha-response"] = token

        const response = await fetch("www", {
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
        $("#message").text("Votre demande est prise en compte, nous vous remercions.")
    }
}

postForm()

export { postForm }