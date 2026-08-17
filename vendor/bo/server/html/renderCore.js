const renderCore = (application, tab, entity, view, theme, locale, profile_id) =>
{
    return `
    <script type="module" src="/bo/cli/controller/load.js" data-json="${ encodeURI(JSON.stringify({ application, tab, entity, view, theme, locale, profile_id })) }" id="module-script"></script>`
}

module.exports = {
    renderCore
}
