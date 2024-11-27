const { renderHead } = require("./renderHead")
const { renderFooter } = require("./renderFooter")
const { renderScripts } = require("./renderScripts")

const render404 = ({ context }, data) => {

    return `<!DOCTYPE html>
    <html lang="fr" ${ (data.darkMode) ? "data-mdb-theme=\"dark\"" : "" }>

    ${ renderHead({ context }, data) }
    
    <style>
    body {
        background-color: hsl(0, 0%, 97%);
    } 
    </style>
    
    <body>        
        <!-- Header -->
        <header>
            <div id="headerDiv">
                ${renderHeader({ context }, data)}
            </div>
        </header>

        <!--Main layout-->
        <main class="mb-5" style="margin-top: 58px">
            <!-- Container for demo purpose -->
            <div class="container px-4">

                <!-- Grid row -->
                <div class="row">
                    <!-- Grid column -->
                    <div class="col-12">
                        <!--Section: Block Content-->
                        <section class="my-5 text-center">
                            <h1 class="display-1">404</h1>

                            <h4 class="mb-4">${ context.translate("Page not found") }</h4>

                            <p class="mb-4">
                                ${ context.translate("The Page you are looking for doesn't exist or an other error occurred.") }
                            </p>
                            <a class="btn btn-primary" href="/" role="button" data-mdb-ripple-init>${ context.translate("Go back to the homepage") }</a>
                        </section>
                        <!--Section: Block Content-->
                    </div>
                    <!-- Grid column -->
                </div>
                <!-- Grid row -->

            </div>
            <!-- Container for demo purpose -->
        </main>
        <!--Main layout-->

        <!-- Footer -->
        ${renderFooter({ context }, data)}
    </body>

    ${ renderScripts({ context }, data) }

    </html>`
}

const renderHeader = ({ context }, data) => {

    const headerParams = data.headerParams, instance = data.instance
    return `<header>
		<nav class="navbar navbar-expand-lg bg-body-tertiary">
			<div class="container-fluid">
				<a class="navbar-brand" href="/">	
					${(headerParams && headerParams.logo) 
        ? `<img height="${headerParams.logoHeight}" src="/${`${instance.caption }/logos/${headerParams.logo}`}" alt="${context.config["headerParams"]["title"]}" title="${context.config["headerParams"]["title"]}" />`
        : `<span>${instance.label}&nbsp;&nbsp;|</span>`}
				</a>

				<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
					<span class="navbar-toggler-icon"></span>
				</button>
				<div class="collapse navbar-collapse" id="navbarSupportedContent">
				</div>
			</div>
		</nav>
	</header>`
}

module.exports = {
    render404
}
