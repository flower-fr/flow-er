const { renderCore } = require("./renderCore")
const { renderHead } = require("../../../bo/server/html/renderHead")
const { renderScripts } = require("../../../bo/server/html/renderScripts")

const renderIndex = (context, theme) =>
{
    return `<!DOCTYPE html>
    <html lang="fr" data-mdb-theme="${ theme }">
    
        ${ renderHead({ context }) }
    
        <body>
        </body>

        ${ renderScripts() }
        ${ renderCore() }

    </html>`
}

module.exports = {
    renderIndex
}