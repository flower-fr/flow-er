const { renderHead } = require("./renderHead")
const { renderHeader } = require("./renderHeader")
const { renderFooter } = require("./renderFooter")
const { renderScripts } = require("./renderScripts")

const renderLoginV2 = ({ context }, data) => {

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
            <div class="container px-4">

                <div class="row d-flex justify-content-center">
                <div class="col-xl-5 col-md-8">
                    <div class="card shadow-4">
                    <div class="card-body p-4">

                        <!-- Pills content -->
                        <div class="tab-content">
                            <div class="tab-pane fade show active" id="flPanelLogin" role="tabpanel" aria-labelledby="tab-login">
                                <div data-mdb-alert-init class="alert" role="alert" id="flErrorLogin" data-mdb-color="danger" style="display: none;"></div>
                                <form method="post" id="flFormLogin">
                                    <input type="hidden" id="flLogin-csrf" value="${data.csrfToken}" />

                                    <!-- Email input -->
                                    <div class="form-outline mb-4" data-mdb-input-init>
                                        <input type="input" id="flLogin-email" name="email" class="form-control" required />
                                        <label class="form-label" for="flLogin-email">${ context.translate("Email") }</label>
                                    </div>

                                    <!-- Password input -->
                                    <div class="form-outline mb-4" data-mdb-input-init>
                                        <i class="far fa-eye trailing fa-fw pe-auto" id="passwordToggleIcon"></i>
                                        <input type="password" id="flLogin-password" name="password" class="form-control fl-password form-icon-trailing" data-fl-toggle-icon="passwordToggleIcon" required />
                                        <label class="form-label" for="flLogin-password">${ context.translate("Password") }</label>
                                    </div>

                                    <!-- 2 column grid layout -->
                                    <div class="row mb-4">
                                        <div class="col-md-6 d-flex justify-content-center">
                                        <!-- Checkbox -->
                                        <div class="form-check mb-3 mb-md-0">
                                            <input class="form-check-input" type="checkbox" value="" id="flLogin-check" checked />
                                            <label class="form-check-label" for="flLogin-check">
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

            <div id="flPanelApp" style="display: none;">
                <h2>Bienvenue, <span id="flDisplay-email"></span> !</h2>
                <button id="btn-fetch-protected">Appeler /protected</button>
                <button id="btn-logout">Se déconnecter</button>
                <div id="protected-result"></div>
            </div>

        </main>
        <!--Main layout-->

        <!-- Footer -->
        ${renderFooter({ context }, data)}
    </body>

    ${ renderScripts({ context }, data) }

    <script>
    let accessToken = null

    const loginForm = document.getElementById("flFormLogin")
    const appPanel = document.getElementById('flPanelApp');
    const loginPanel = document.getElementById('flPanelLogin');
    const flDisplayEmail = document.getElementById('flDisplay-email');
    const loginError = document.getElementById("flErrorLogin")
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        loginError.textContent = '';

        const csrfToken = document.getElementById('flLogin-csrf').value;
        const email = document.getElementById('flLogin-email').value;
        const password = document.getElementById('flLogin-password').value;

        try {
            const response = await fetch('/user/loginV2', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ csrfToken, email, password }),
                credentials: 'include',
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Erreur de connexion');
            }

            const data = await response.json();
            accessToken = data.accessToken;

            // Affiche l'application
            loginPanel.style.display = 'none';
            appPanel.style.display = 'block';
            flDisplayEmail.textContent = email;
        } catch (err) {
            loginError.style.display = 'block';
            loginError.textContent = err.message;
        }
    })
    </script>

    </html>`
}

module.exports = {
    renderLoginV2
}
