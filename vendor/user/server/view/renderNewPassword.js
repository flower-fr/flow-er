const { renderHead } = require("./renderHead")
const { renderHeader } = require("./renderHeader")
const { renderFooter } = require("./renderFooter")
const { renderScripts } = require("./renderScripts")

const renderNewPassword = ({ context, rule }, data) => {
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

                            ${ (data.status == "410") ? 
        `<div data-mdb-alert-init class="alert" role="alert" data-mdb-color="warning">
                            ${ context.translate("This link has expired. Enter your email to receive a new one.") }
                            </div>` : (data.status == "403") ?
            `<div data-mdb-alert-init class="alert" role="alert" data-mdb-color="danger">
                            ${ context.translate("Invalid authentication, please try again") }
                            </div>` : (data.status == "401") ?
                `<div data-mdb-alert-init class="alert" role="alert" data-mdb-color="danger">
                            ${ context.translate("The form has expired, please input again") }
                            </div>` : (data.status == "200") ?
                    `<div data-mdb-alert-init class="alert" role="alert" data-mdb-color="success">
                            ${ context.translate("Your request has been registered") }
                            </div>` : (data.status == "400") ?
                        `<div data-mdb-alert-init class="alert" role="alert" data-mdb-color="danger">
                                ${ context.translate("This link is invalid.") }
                            </div>` : (data.status == "500") ?
                            `<div data-mdb-alert-init class="alert" role="alert" data-mdb-color="danger">
                                ${ context.translate("A technical error has occured. PLease try again later") }
                            </div>` : "" }

                            ${ (data.status !== "200" && data.status !== "400" && data.status !== "410" && data.status !== "500") ? `
                            <form method="post" class="was-validated" id="flPasswordNewForm">
                                <input type="hidden" name="csrfToken" value="${data.csrfToken}" />
                                <input type="hidden" name="token" value="${data.token}" />

                                <div class="text-center mb-3">
                                    <p>${ context.translate("New password") }</p>
                                </div>

                                <div data-mdb-alert-init class="alert fl-alert" id="flAlertOk" role="alert" data-mdb-color="success">
                                    ${context.translate("Your request has been registered")}
                                </div>

                                <div data-mdb-alert-init class="alert fl-alert" id="flAlertConsistency" role="alert" data-mdb-color="danger">
                                    ${context.translate("Both new passwords are not the same")}
                                </div>

                                <div data-mdb-alert-init class="alert fl-alert" id="flAlertIntegrity" role="alert" data-mdb-color="danger">
                                    ${ context.localize(context.config["user/password"]["ruleText"]) }
                                </div>

                                <div data-mdb-alert-init class="alert fl-alert" id="flAlertUnauthorized" role="alert" data-mdb-color="danger">
                                    ${context.translate("Invalid email or password")}
                                </div>

                                <div data-mdb-alert-init class="alert fl-alert" id="flAlertFormExpired" role="alert" data-mdb-color="danger">
                                    ${context.translate("The form has expired, please refresh the page")}
                                </div>

                                <div data-mdb-alert-init class="alert fl-alert" id="flAlertServerError" role="alert" data-mdb-color="danger">
                                    ${context.translate("A technical error has occured. PLease try again later")}
                                </div>

                                <!-- Email input -->
                                <div class="form-outline mb-3" data-mdb-input-init>
                                    <input type="input" id="email" name="email" class="form-control" required />
                                    <label class="form-label" for="email">${ context.translate("Email") }</label>
                                </div>

                                <!-- New password -->
                                <div class="form-outline mb-3" data-mdb-input-init>
                                    <i class="far fa-eye trailing fa-fw pe-auto" id="newPasswordToggleIcon"></i>
                                    <input type="password" id="newPassword" name="newPassword" class="form-control fl-password form-icon-trailing" data-fl-toggle-icon="newPasswordToggleIcon" required />
                                    <label class="form-label" for="newPassword">${ context.translate("New password") }</label>
                                </div>

                                <!-- Password check -->
                                <div class="form-outline mb-4" data-mdb-input-init>
                                    <i class="far fa-eye trailing fa-fw pe-auto" id="checkPasswordToggleIcon"></i>
                                    <input type="password" id="checkPassword" class="form-control fl-password form-icon-trailing" data-fl-toggle-icon="checkPasswordToggleIcon" required />
                                    <label class="form-label" for="checkPassword">${ context.translate("New password checking") }</label>
                                </div>

                                <!-- Submit button -->
                                <button type="submit" class="btn btn-danger btn-block mb-4 fl-submit" data-mdb-ripple-init>
                                    ${ context.translate("Save") }
                                </button>
                            </form>` : (data.status == "410") ? `

                            <form id="flResendForm">
                            <input type="hidden" name="csrfToken" value="${data.csrfToken}">
                            <div class="form-outline mb-3" data-mdb-input-init>
                                <input type="email" id="resendEmail" name="email" class="form-control" required>
                                <label class="form-label" for="resendEmail">${ context.translate("Email") }</label>
                            </div>
                            <div data-mdb-alert-init class="alert fl-resend-ok" role="alert" data-mdb-color="success" style="display:none">
                                ${ context.translate("If an account matches, a new link has been sent.") }
                            </div>
                            <button type="submit" class="btn btn-danger btn-block mb-4 fl-resend-submit" data-mdb-ripple-init>
                                ${ context.translate("Send a new link") }
                            </button>
                            </form>` : `

                            <div class="text-center fl-next-link">
                                <a href="/user/login">${ context.translate("Log in") }</a>
                            </div>` }

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

    <script type="text/javascript" src="/user/cli/controller/triggerNewPassword.js"></script>

    <script>
    triggerNewPassword(${ rule })
    triggerResendLink()
    </script>

    </html>`
}

module.exports = {
    renderNewPassword
}
