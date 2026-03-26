const renderCore = (application, tab, entity, view) =>
{
    return `
    <script type="module" src="/bo/cli/controller/load.js" data-json="${ encodeURI(JSON.stringify({ application, tab, entity, view })) }" id="module-script"></script>`
}

module.exports = {
    renderCore
}
