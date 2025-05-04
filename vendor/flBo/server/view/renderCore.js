const renderCore = ({ context, entity, view }, data) => {

    return `
    <script src="/flBo/cli/controller/check-form.js"></script>
    <!-- <script src="/flBo/cli/controller/triggerShortcuts.js"></script>
    <script src="/flBo/cli/controller/triggerList.js"></script>
    <script src="/flBo/cli/controller/triggerOrder.js"></script>
    <script src="/flBo/cli/controller/triggerModalList.js"></script>
    <script src="/flBo/cli/controller/triggerModalListTab.js"></script>
    <script src="/flBo/cli/controller/detail.js"></script>
    <script src="/flBo/cli/controller/getTab.js"></script>
    <script src="/flBo/cli/controller/getGroupTab.js"></script> -->
    
    <script type="module" src="/flBo/cli/controller/loadPage.js" data-json="${ encodeURI(JSON.stringify({ "entity": entity, "view": view })) }" id="module-script"></script>
    <script type="module" src="/flBo/cli/controller/group.js" data-json="${ encodeURI(JSON.stringify({ "entity": entity, "view": view })) }" id="module-script"></script>`
}

module.exports = {
    renderCore
}
