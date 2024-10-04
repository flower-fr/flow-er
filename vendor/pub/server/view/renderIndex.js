const { renderHead } = require("./renderHead")
const { renderScripts } = require("./renderScripts")
const { renderForm } = require("./renderForm")

const renderIndex = ({ context, entity, view }, data) => {

    const user = data.user

    return `<!DOCTYPE html>
    <html lang="fr" data-bs-theme="${ (data.formConfig.theme) ? data.formConfig.theme : "light" }" }>
    
    ${ renderHead({ context, entity, view }, data) }

    <script src="https://www.google.com/recaptcha/enterprise.js?render=${data.recaptchaToken}"></script>

    <body>
        <div id="form">
        ${ renderForm({ context, entity, view}, { properties: data.properties }) }
        </div>
    </body>

    ${ renderScripts({ context, entity, view }, data) }
           
    <script src="/pub/cli/controller/formPost.js"></script>
    <script>
    triggerPost("${entity}", "${data.recaptchaToken}")
    </script>

    </html>`
}

module.exports = {
    renderIndex
}
