const { renderCore } = require("./renderCore")
const { renderHead } = require("./renderHead")
const { renderScripts } = require("./renderScripts")

const renderIndex = ({ context, entity, view, locale, theme, title }) =>
{
    return `<!DOCTYPE html>
    <html lang="fr" data-mdb-theme="${ theme }">
    
        ${ renderHead({ context, title }) }
    
        <body>
        </body>

        ${ renderScripts() }
        ${ renderCore({ entity, view, locale }) }

    </html>`
}

module.exports = {
    renderIndex
}