function removeTags(str) {
    if (str) {
        str = str.toString()
        return str.replace(/(<([^>]+)>)/ig, '')
    }
}

$(".updateMessage").hide()

const triggerPost = ({ context, entity, view }, recaptchaToken) => {
    const form = document.getElementById("customForm")
    if (form) {
        form.onsubmit = async function (event) {
            event.preventDefault()

            const submits = document.querySelectorAll('input[type=submit]')
            for (let submit of submits) submit.setAttribute("disabled", true)

            grecaptcha.enterprise.ready(async () => {
                const data = {}
                data.token = await grecaptcha.enterprise.execute(recaptchaToken, {action: 'LOGIN'});

                for (let property of document.getElementsByClassName("property")) {
                    const propertyId = property.getAttribute("id")
                    data[propertyId] = property.value.replace(/(<([^>]+)>)/ig, '')
                }
                const route = `/pub/${entity}?view=${view}`

                const http = await fetch(route, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                })

                if (http.status == 200) {
                    const body = await http.json()
                    if (body && body.redirect) {
                        window.parent.location = body.redirect
                    }
                    $(".property").prop("disabled", true)
                    $("#updateMessageOk").show()
                }
            });
        }
    }
}
