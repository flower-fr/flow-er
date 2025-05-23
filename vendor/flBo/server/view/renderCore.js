const renderCore = ({ context, entity, view }, data) => {

    return `
    
    <script type="module" src="/flBo/cli/controller/loadPage.js" data-json="${ encodeURI(JSON.stringify({ "entity": entity, "view": view })) }" id="module-script"></script>
    <script type="module" src="/flBo/cli/controller/group.js" data-json="${ encodeURI(JSON.stringify({ "entity": entity, "view": view })) }" id="module-script"></script>`
}

module.exports = {
    renderCore
}
