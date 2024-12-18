const { renderHead } = require("./renderHead")
const { renderHeader } = require("./renderHeader")
const { renderFooter } = require("./renderFooter")
const { renderScripts } = require("./renderScripts")

const renderLogin = ({ context }, data) => {

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

                            ${ (data.status == "403") ?
        `<div data-mdb-alert-init class="alert" role="alert" data-mdb-color="danger">
                            ${ context.translate("Invalid authentication, please try again") }
                            </div>` 
        : "" }

                            <form method="post">
                                <div class="text-center mb-3">
                                    <p>${ context.translate("Sign in with:") }</p>

                                    <button type="button" class="btn btn-link btn-lg btn-floating mx-1" data-mdb-ripple-init data-ripple-color="primary">
                                    <i class="fab fa-google"></i>
                                    </button>

                                </div>

                                <p class="text-center">${ context.translate("or:") }</p>

                                <!-- Email input -->
                                <div class="form-outline mb-4" data-mdb-input-init>
                                    <input type="input" id="loginName" name="email" class="form-control" required />
                                    <label class="form-label" for="loginName">${ context.translate("Identifier") }</label>
                                </div>

                                <!-- Password input -->
                                <div class="form-outline mb-4" data-mdb-input-init>
                                    <input type="password" id="loginPassword" name="password" class="form-control" required />
                                    <label class="form-label" for="loginPassword">${ context.translate("Password") }</label>
                                </div>

                                <!-- 2 column grid layout -->
                                <div class="row mb-4">
                                    <div class="col-md-6 d-flex justify-content-center">
                                    <!-- Checkbox -->
                                    <div class="form-check mb-3 mb-md-0">
                                        <input class="form-check-input" type="checkbox" value="" id="loginCheck" name="loginCheck" checked />
                                        <label class="form-check-label" for="loginCheck">
                                        ${ context.translate("Remember me") }
                                        </label>
                                    </div>
                                    </div>

                                    <div class="col-md-6 d-flex justify-content-center">
                                    <!-- Simple link -->
                                    <a href="#!">${ context.translate("Forgot password?") }</a>
                                    </div>
                                </div>

                                <!-- Submit button -->
                                <button type="submit" class="btn btn-primary btn-block mb-4" data-mdb-ripple-init>
                                    ${ context.translate("Sign in") }
                                </button>
                            </form>
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
    renderLogin
}
