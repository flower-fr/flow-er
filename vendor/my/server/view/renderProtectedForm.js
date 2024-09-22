
const { renderHead } = require("../../../bo/server/view/renderHead")
const { mdbRenderHead } = require("../../../mdb/server/view/mdbRenderHead")
const { renderScripts } = require("../../../bo/server/view/renderScripts")
const { mdbRenderScripts } = require("../../../mdb/server/view/mdbRenderScripts")

const renderProtectedForm = ({ context, entity, view }, data) => {

    const user = data.user, row = data.row, renderer = (data.formConfig.renderer) ? data.formConfig.renderer : "bootstrap"
    const headRenderer = (renderer == "mdb") ? mdbRenderHead : renderHead
    const scriptsRenderer = (renderer == "mdb") ? mdbRenderScripts : renderScripts

    return `<!DOCTYPE html>
    <html lang="fr" data-bs-theme="${ (data.formConfig.theme) ? data.formConfig.theme : "dark" }" } data-mdb-theme="${ (data.formConfig.theme) ? data.formConfig.theme : "dark" }" }>
    
    ${headRenderer({ context, entity, view }, data)}
    
    <body>
        
        <!-- Header -->
        <div id="headerDiv">
            ${renderHeader({ context, entity, view }, data)}
        </div>

        <div class="container-sm my-5">
            <div class="row">
                <div class="col" id="form">
                </div>
            </div>
        </div>
    
        <!-- Footer -->
        ${renderFooter({ context, entity, view }, data)}
        
    </body>

    ${scriptsRenderer({ context, entity, view }, data)}

    <!-- Pluggable renderers by index config -->
    <script src="/my/cli/controller/loadForm.js"></script>
    <script src="/bo/cli/bootstrap/renderForm.js"></script>
    <script src="/mdb/cli/mdbootstrap/renderForm.js"></script>

    <script src="/mdb/cli/controller/mdbFormCallback.js"></script>

    <script>
    formRenderer = ${ (renderer == "mdb") ? "mdbRenderForm" : "renderForm" }
    formCallback = ${ (renderer == "mdb") ? "mdbFormCallback" : "({ context, entity, view }) => {}" }
    loadForm({ entity: "${entity}", view: "${view}"}, { row: ${ JSON.stringify(row) } })
    </script>

    </html>`
}

const renderHeader = ({ context }, data) => {

	const headerParams = context.config.headerParams, instance = context.instance, user = data.user, applications = data.applications, applicationName = data.applicationName

    return `<header>
		<nav class="navbar navbar-expand-lg bg-body-tertiary">
			<div class="container-fluid">
				<a class="navbar-brand" href="#">	
					${(headerParams && headerParams.logo) 
        ? `<img height="${headerParams.logoHeight}" src="/${`${instance.caption }/logos/${headerParams.logo}`}" alt="${instance.caption} logo" />`
        : `<span>${instance.caption}&nbsp;&nbsp;|</span>`}
				</a>
				<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
					<span class="navbar-toggler-icon"></span>
				</button>
			</div>
		</nav>
	</header>`
}

const renderFooter = ({ context }, data) => {

    const footer = context.config.footer

    return `
    <!--Footer-->
    <footer class="container-fluid bg-body-tertiary">
        <div>
            <div class="row">
                <!--Copyright-->
                <div class="py-3 my-3 text-center container-fluid">
                    ${renderLinks({ context }, footer)}              
                </div>
        
            </div>
        </div>
    </footer>`
}

const renderLinks = ({ context }, footer) => {

    const links = []
    for (let link of footer) {
        links.push(context.localize(link.html))
    }
    return links.join("&nbsp;&nbsp;|&nbsp;&nbsp;")
}

module.exports = {
    renderProtectedForm
}
