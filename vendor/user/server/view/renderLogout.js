const { renderHead } = require("./renderHead")
const { renderHeader } = require("./renderHeader")
const { renderFooter } = require("./renderFooter")
const { renderScripts } = require("./renderScripts")

const renderLogout = ({ context }, data) => {

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
        <div id="headerDiv">
            ${renderHeader({ context }, data)}
        </div>
                
        <!-- Heading -->
        <section class="text-center text-md-start">
            <!-- Background gradient -->
            <div class="p-5" style="height: 200px; 
                                    background: linear-gradient(
                                    to right,
                                    hsl(209, 42.2%, 65%),
                                    hsl(209, 42.2%, 85%)
                                    );">
            </div>
            <!-- Background gradient -->
        </section>
        <!-- Heading -->

        </header>

        <!--Main layout-->
        <main class="mb-5" style="margin-top: -100px;">
        <!-- Container for demo purpose -->
        <div class="container px-4">

            <div class="row d-flex justify-content-center">
            <div class="col-xl-5 col-md-8">
                <div class="card shadow-4">
                <div class="card-body p-4">

                    <!-- Pills content -->
                    <div class="tab-content">
                        <div class="tab-pane fade show active" id="pills-login" role="tabpanel" aria-labelledby="tab-login">
                            <div class="updateMessage" id="updateMessageOk">
                                <h5 class="alert alert-success my-3 text-center">${context.translate("You are well logged out")}</h5>
                            </div>
                        </div>
                    </div>
                    <!-- Pills content -->
                </div>
                </div>
            </div>
            </div>

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

module.exports = {
    renderLogout
}
