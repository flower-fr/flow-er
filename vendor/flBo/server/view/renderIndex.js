const { renderHead } = require("./renderHead")
const { renderHeader } = require("./renderHeader")
const { renderMenu } = require("./renderMenu")
const { renderTable } = require("./renderTable")
const { renderChips } = require("./renderChips")
const { renderFooter } = require("./renderFooter")
const { renderScripts } = require("./renderScripts")

const renderIndex = ({ context, entity, view }, data) => {
    
    const tab = data.tab

    return `<!DOCTYPE html>
    <html lang="fr" ${ (tab.darkMode) ? "data-mdb-theme=\"dark\"" : "" }>
    
    ${ renderHead({ context, entity, view }, data) }
    
    <body>
       
        <input type="hidden" id="flInstanceCaption" value="${data.instance.caption}" />
        <input type="hidden" id="flListWhereHidden" value="${data.where}" />
        <input type="hidden" id="flListOrderHidden" value="${data.order}" />
        <input type="hidden" id="flListLimitHidden" value="${data.limit}" />
    
        <nav
            id="sidenav"
            data-mdb-sidenav-init
            class="sidenav"
            data-mdb-mode="push"
            data-mdb-content="#content"
        >
        </nav>

        <div id="content">

            <!-- Header -->
            <div id="headerDiv">
                ${renderHeader({ context, entity, view }, data)}
            </div>

            <div class="m-3">

                <div class="row">
                    ${renderMenu({ context, entity, view }, data)}
                </div>

                <div class="row">
                    <section class="p-4 d-flex flex-wrap w-100">
                        <div>
                            <button data-mdb-ripple-init="" data-mdb-toggle="sidenav" data-mdb-target="#sidenav" class="btn btn-primary" aria-controls="#sidenav" aria-haspopup="true" style="" aria-expanded="false">
                                <i class="fas fa-bars"></i>
                            </button>
                        </div>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        
                        ${ renderChips({ context, entity, view }, data.properties) }

                    </section>

                    <div class="section" id="dataview">
                        ${ renderTable({ context, entity, view }, data) }
                    </div>
                </div>
            </div>
            
            <div class="modal fade" id="listDetailModalForm" tabindex="-1" role="dialog" data-backdrop="static" aria-labelledby="listDetailModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="listDetailModalLabel"></h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" data-mdb-dismiss="modal" aria-label="Close" title="${context.localize("Cancel")}"></button>
                        </div>
                        <div class="modal-body" id="listDetailModal">
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Footer -->
            ${renderFooter({ context, entity, view }, data)}

        </div>
    </body>

    ${ renderScripts({ context, entity, view }, data) }

    <!-- Pluggable renderers by index config -->
    <script src="/flbo/cli/view/renderSearch.js"></script>
    <script src="/flbo/cli/view/renderList.js"></script>
    <!-- TODO
    <script src="/flbo/cli/view/renderDetail.js"></script>
    <script src="/flbo/cli/view/renderGroup.js"></script>
    <script src="/flbo/cli/view/renderModalCalendar.js"></script>
    <script src="/flbo/cli/view/renderModalList.js"></script>

    <script src="/flbo/cli/controller/searchCallback.js"></script>
    <script src="/flbo/cli/controller/ListCallback.js"></script>
    <script src="/flbo/cli/controller/CalendarCallback.js"></script>
    <script src="/flbo/cli/controller/ChartCallback.js"></script>
    <script src="/flbo/cli/controller/formCallback.js"></script>
    <script src="/flbo/cli/controller/modalCalendarCallback.js"></script>
    <script src="/flbo/cli/controller/modalListCallback.js"></script>

    <script src="/flbo/cli/controller/fullcalendarCallback.js"></script> -->

    <script>
    const mdb=false
    const getShortcutsRoute = () => { return "/bo/shortcuts/${entity}?view=${view}" }
    const getSearchRoute = () => { return "/flBo/search/${entity}?view=${view}" }
    const getListRoute = () => { return "${ (data.indexConfig && data.indexConfig.listView) ? data.indexConfig.listView : "/bo/list" }/${entity}?view=${view}" }
    const getDetailRoute = () => { return "/bo/detail/${entity}" }
    const getGroupRoute = () => { return "/bo/group/${entity}" }

    const searchRenderer = renderSearch
    const listRenderer = renderList
    const listCallback = () => {}
 
    loadPage({ entity: "${entity}", view: "${view}" })

    </script>

    </html>`
}

module.exports = {
    renderIndex
}
