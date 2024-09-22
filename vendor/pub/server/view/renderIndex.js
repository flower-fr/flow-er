const { renderHead } = require("../../../bo/server/view/renderHead")
const { renderScripts } = require("../../../bo/server/view/renderScripts")
const { renderForm } = require("./renderForm")

const renderIndex = ({ context, entity, view }, data) => {

    const user = data.user

    return `<!DOCTYPE html>
    <html lang="fr" data-bs-theme="${ (data.formConfig.theme) ? data.formConfig.theme : "light" }" }>
    
    ${ renderHead({ context, entity, view }, data) }

    <script src="https://www.google.com/recaptcha/enterprise.js?render=6LewVNcpAAAAAI1Wo8s3o2SlmnPuCVoBu5w-rSaz"></script>

    <body>
        <div id="form">
        ${ renderForm({ context, entity, view}, { properties: data.properties }) }
        </div>
    </body>

    ${ renderScripts({ context, entity, view }, data) }
           
    <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBVWaKrjvy3MaE7SQ74_uJiULgl1JY0H2s&sensor=false"></script>
    <script>

    $(".updateMessage").hide()

    const form = document.getElementById("customForm")
    if (form) {
        form.onsubmit = async function (event) {
            event.preventDefault()

            grecaptcha.enterprise.ready(async () => {
                const data = {}
                data.token = await grecaptcha.enterprise.execute('${ data.recaptchaToken }', {action: 'LOGIN'});

                for (let property of document.getElementsByClassName("property")) {
                    const propertyId = property.getAttribute("id")
                    data[propertyId] = property.value
                }

                const route = "/pub/${entity}"

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
    </script>
    </html>`
}

module.exports = {
    renderIndex
}
