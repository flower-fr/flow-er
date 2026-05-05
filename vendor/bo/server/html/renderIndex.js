const { renderCore } = require("./renderCore")
const { renderHead } = require("./renderHead")
const { renderScripts } = require("./renderScripts")

const renderIndex = (context, application, tab, entity, view, title, theme, locale) =>
{
    return `<!DOCTYPE html>
    <html lang="fr" data-mdb-theme="${ theme }">
    
        ${ renderHead({ title }) }
    
        <body />

        ${ renderScripts() }
        ${ renderCore(application, tab, entity, view, locale) }

    </html>`
}

module.exports = {
    renderIndex
}