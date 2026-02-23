const renderCore = ({ entity, view, locale }) =>
{
    return `
    <script type="module" src="/bo/cli/controller/load.js" data-json="${ encodeURI(JSON.stringify({ entity, view, locale })) }" id="module-script"></script>`
}

module.exports = {
    renderCore
}
