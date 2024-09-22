const { renderHead } = require("../../../bo/server/view/renderHead")
const { renderScripts } = require("./renderScripts")

const renderPublicForm = ({ context, entity, view }, data) => {

    const user = data.user

    return `<!DOCTYPE html>
    <html lang="fr" data-bs-theme="${ (data.formConfig.theme) ? data.formConfig.theme : "dark" }" }>
    
    ${ renderHead({ context, entity, view }, data) }

    <script src="https://www.google.com/recaptcha/enterprise.js?render=6LewVNcpAAAAAI1Wo8s3o2SlmnPuCVoBu5w-rSaz"></script>

    <body><div id="form"></div></body>

    ${ renderScripts({ context, entity, view }, data) }
           
    <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBVWaKrjvy3MaE7SQ74_uJiULgl1JY0H2s&sensor=false"></script>
    <script>
    function onClick(e) {
      e.preventDefault();
      grecaptcha.enterprise.ready(async () => {
        const token = await grecaptcha.enterprise.execute('6LewVNcpAAAAAI1Wo8s3o2SlmnPuCVoBu5w-rSaz', {action: 'LOGIN'});
      });
    }
    </script>

    <!-- Pluggable renderers by index config -->
    <script src="/my/cli/controller/loadForm.js"></script>
    <script src="/bo/cli/bootstrap/renderForm.js"></script>

    <script>
    formRenderer = renderForm
    formCallback = ({ context, entity, view }) => {}
    loadForm({ entity: "${entity}", view: "${view}" }, {})
    </script>

    </html>`
}

module.exports = {
    renderPublicForm
}
