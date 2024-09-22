
const { renderHead } = require("./renderHead")
const { renderScripts } = require("./renderScripts")

const renderIndex = ({ context, entity, view }, data) => {

    const tab = data.tab, indexConfig = data.indexConfig

    return `<!DOCTYPE html>
    <html lang="fr" ${ (tab.darkMode) ? "data-bs-theme=\"dark\"" : "" }>
    
    ${ renderHead({ context, entity, view }, data) }
    
    <body></body>

    ${ renderScripts({ context, entity, view }, data) }
    
    <!-- Flow-ER -->
    ${ renderCore({ context, entity, view }, data) }

    <!-- Pluggable renderers by index config -->
    <script src="/bo/cli/bootstrap/renderHeader.js"></script>
    <script src="/bo/cli/bootstrap/renderHiddenRoutes.js"></script>
    <script src="/bo/cli/bootstrap/renderBody4.js"></script>
    <script src="/bo/cli/bootstrap/renderBody10.js"></script>
    <script src="/bo/cli/bootstrap/renderBody12.js"></script>
    <script src="/bo/cli/bootstrap/renderCalendar.js"></script>
    <script src="/bo/cli/bootstrap/renderChart.js"></script>
    <script src="/bo/cli/bootstrap/renderDelta.js"></script>
    <script src="/bo/cli/bootstrap/renderColumns.js"></script>
    <script src="/bo/cli/bootstrap/renderDetail.js"></script>
    <script src="/bo/cli/bootstrap/renderFooter.js"></script>
    <script src="/bo/cli/bootstrap/renderList.js"></script>
    <script src="/bo/cli/bootstrap/renderListHeader.js"></script>
    <script src="/bo/cli/bootstrap/renderTable.js"></script>
    <script src="/bo/cli/bootstrap/renderCross.js"></script>
    <script src="/bo/cli/bootstrap/renderModalList.js"></script>
    <script src="/bo/cli/bootstrap/renderModalListTabs.js"></script>
    <script src="/bo/cli/bootstrap/renderModalListForm.js"></script>
    <script src="/bo/cli/bootstrap/renderMenu.js"></script>
    <script src="/bo/cli/bootstrap/renderUpdate.js"></script>
    <script src="/bo/cli/bootstrap/renderShortcuts.js"></script>
    <script src="/bo/cli/bootstrap/renderSearch.js"></script>

    <!-- Alternative renderers by design block -->

    <script src="/bo/cli/controller/fullcalendarCallback.js"></script>
    <script src="/bo/cli/controller/zingchartCallback.js"></script>

    <script>
    const bodyRenderer = ${ (indexConfig && indexConfig.bodyRenderer) ? indexConfig.bodyRenderer : "renderBody12" }
    const searchRenderer = ${ (indexConfig && indexConfig.searchRenderer) ? indexConfig.searchRenderer : "renderListHeader" }
    const listRenderer = ${ (indexConfig && indexConfig.listRenderer) ? indexConfig.listRenderer : "renderList" }
    const searchCallback = ({ context, entity, view }) => {}
    const listCallback = ({ context, entity, view }) => {}
    const calendarCallback = fullcalendarCallback
    const chartCallback = zingchartCallback
    const chart2Callback = zingchart2Callback
    const chart3Callback = zingchart2Callback
    const updateCallback = ({ context, entity, view }) => {}
    const modalListCallback = ({ context, entity, view }) => {}
    const modalListTabsCallback = ({ context, entity, view }) => {}
    const modalListFormCallback = ({ context, entity, view }) => {}
    loadPage({ entity: "${entity}", view: "${view}" })
    </script>

    </html>`
}

module.exports = {
    renderIndex
}
