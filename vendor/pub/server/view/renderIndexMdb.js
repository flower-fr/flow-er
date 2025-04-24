const { mdbRenderHead } = require("./mdbRenderHead")
const { renderStyle } = require("./renderStyle")
const { mdbRenderScripts } = require("./mdbRenderScripts")
const { renderFormMdb } = require("./renderFormMdb")

const renderIndexMdb = ({ context, entity, view }, data) => {

    const formConfig = data.formConfig

    return `<!DOCTYPE html>
    <html lang="fr" data-bs-theme="${ (formConfig.theme) ? formConfig.theme : "light" }" }>
    
    ${ mdbRenderHead({ context, entity, view }, data) }

    ${ (data.recaptchaToken) ? `<script src="https://www.google.com/recaptcha/enterprise.js?render=${data.recaptchaToken}"></script>`: "" }

    ${ renderStyle({ context, entity, view }, data) }

    <body>
        ${ (formConfig.header) ? `
            <header>
                <nav class="navbar navbar-expand-lg bg-body-tertiary">
                    <div class="container-fluid">
                        <div class="collapse navbar-collapse" id="navbarSupportedContent">
                            <a class="navbar-brand" href="#">	
                                <img height="40" src="${ formConfig.header.logo }" alt="DOUBLE CREAM" title="DOUBLE CREAM" />
                            </a>
                        </div>
                    </div>
                </nav>
            </header>` : "" }

        <div id="form">
        ${ renderFormMdb({ context, entity, view}, data) }
        </div>
    </body>

    ${ mdbRenderScripts({ context, entity, view }, data) }
           
    <script src="/pub/cli/controller/index.js"></script>
    <script src="/pub/cli/controller/mdbFormCallback.js"></script>
    <script src="/pub/cli/controller/formPost.js"></script>
    <script src="/pub/cli/view/renderCsrMdb.js"></script>
    <script>
    loadPage({ entity: "${entity}", view: "${view}" })
    triggerPost({ "entity": "${entity}", "view": "${view}" }, ${ (data.recaptchaToken) ? `"${data.recaptchaToken}"` : false })
    </script>
    </html>`
}

module.exports = {
    renderIndexMdb
}
