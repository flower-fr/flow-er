const { renderCore } = require("./renderCore")
const { renderHead } = require("./renderHead")
const { renderScripts } = require("./renderScripts")

const renderIndex = (context, application, tab, { entity, view }, title, theme) =>
{
    return `<!DOCTYPE html>
    <html lang="fr" data-mdb-theme="${ theme }">
    
        ${ renderHead({ context, title }) }
    
        <body>
        </body>

        ${ renderScripts() }
        ${ renderCore(application, tab, entity, view) }

    </html>`
}

module.exports = {
    renderIndex
}