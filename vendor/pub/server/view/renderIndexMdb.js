const { mdbRenderHead } = require("./mdbRenderHead")
const { mdbRenderScripts } = require("./mdbRenderScripts")
const { renderFormMdb } = require("./renderFormMdb")

const renderIndexMdb = ({ context, entity, view }, data) => {

    const user = data.user

    return `<!DOCTYPE html>
    <html lang="fr" data-bs-theme="${ (data.formConfig.theme) ? data.formConfig.theme : "light" }" }>
    
    ${ mdbRenderHead({ context, entity, view }, data) }

    <script src="https://www.google.com/recaptcha/enterprise.js?render=${data.recaptchaToken}"></script>

    <body>
        <div id="form">
        ${ renderFormMdb({ context, entity, view}, { properties: data.properties }) }
        </div>
    </body>

    ${ mdbRenderScripts({ context, entity, view }, data) }
           
    <script src="/pub/cli/controller/formPost.js"></script>
    <script>
    triggerPost("${entity}", "${data.recaptchaToken}")
    </script>
    </html>`
}

module.exports = {
    renderIndexMdb
}
