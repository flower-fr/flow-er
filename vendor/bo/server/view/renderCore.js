const renderCore = ({ context, entity, view }, data) => {

    return `
    <script src="/bo/cli/controller/check-form.js"></script>
    <script src="/bo/cli/controller/index.js"></script>
    <script src="/bo/cli/controller/getSearchParams.js"></script>
    <script src="/bo/cli/controller/loadView.js"></script>
    <script src="/bo/cli/controller/triggerCount.js"></script>
    <script src="/bo/cli/controller/triggerList.js"></script>
    <script src="/bo/cli/controller/triggerModalList.js"></script>
    <script src="/bo/cli/controller/triggerModalListTab.js"></script>
    <script src="/bo/cli/controller/triggerOrder.js"></script>
    <script src="/bo/cli/controller/triggerSearch.js"></script>
    <script src="/bo/cli/controller/triggerShortcuts.js"></script>
    <script src="/bo/cli/controller/getListRows.js"></script>
    <script src="/bo/cli/controller/getDeltaRows.js"></script>
    <script src="/bo/cli/controller/detail.js"></script>
    <script src="/bo/cli/view/search.js"></script>

    <!-- Rendering utility functions -->
    <script src="/bo/cli/bootstrap/renderLayout.js"></script>`
}

module.exports = {
    renderCore
}
