const { renderHead } = require("./renderHead")
const { renderHeader } = require("./renderHeader")
const { renderMenu } = require("./renderMenu")
const { renderTable } = require("./renderTable")
const { renderSearchInput } = require("./renderSearchInput")
const { renderFooter } = require("./renderFooter")
const { renderScripts } = require("./renderScripts")

const renderIndex = ({ context, entity, view }, data) => {
    
    const tab = data.tab, indexConfig = data.indexConfig

    return `<!DOCTYPE html>
    <html lang="fr" ${ (tab.darkMode) ? "data-mdb-theme=\"dark\"" : "" }>
    
    ${ renderHead({ context, entity, view }, data) }
    
    <body>
        <input type="hidden" id="detailRoute" value="/bo/detail/${entity}" />
       
        <input type="hidden" id="flListOrderHidden" value="${data.order}" />
        <input type="hidden" id="flListLimitHidden" value="${data.limit}" />
    
        <div class="modal fade" id="flNavModal" tabindex="-1" role="dialog" data-backdrop="static" aria-labelledby="flNavModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="flNavModalLabel"></h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" title="${context.localize("Cancel")}"></button>
                    </div>
                    <div class="modal-body" id="sidenav"></div>
                </div>
            </div>
        </div>

        <div id="content">

            <!-- Header -->
            <div id="headerDiv">
                ${renderHeader({ context, entity, view }, data)}
            </div>

            <div class="m-3">

                <div class="row">
                    <section class="p-4 d-flex flex-wrap w-100">
                        <div>
                            <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#flNavModal">
                                <i class="fas fa-bars"></i>
                            </button>
                        </div>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        
                        ${ renderSearchInput({ context, entity, view }, indexConfig) }

                    </section>

                    <div class="section" id="dataview">
                        ${ renderTable({ context, entity, view }, data) }
                    </div>
                </div>
            </div>
                                    
            <!-- detailModal -->
            
            <div class="modal fade" id="flModal" tabindex="-1" role="dialog" data-backdrop="static" aria-labelledby="flModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-xl" role="document">
                    <div class="modal-content" id="flModalContent">
                    </div>
                </div>
            </div>

            <!-- listDetailModal -->
            
            <div class="modal fade" id="flListDetailModalForm" tabindex="-1" role="dialog" data-backdrop="static" aria-labelledby="flListDetailModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-xl" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="flListDetailModalLabel"></h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" data-mdb-dismiss="modal" aria-label="Close" title="${context.localize("Cancel")}"></button>
                        </div>
                        <div class="modal-body">
                            <div class="container-fluid" id="flListDetailModal">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- globalModal -->
            
            <div class="modal fade" id="flGlobalModalForm" tabindex="-1" role="dialog" data-backdrop="static" aria-labelledby="flGlobalModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-xl" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="flGlobalModalLabel">${ context.translate("Global actions") }</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" data-mdb-dismiss="modal" aria-label="Close" title="${context.localize("Cancel")}"></button>
                        </div>
                        <div class="modal-body">
                            <div class="container-fluid" id="flGlobalModal">
                            </div>
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
    <script src="/flBo/cli/view/renderListHeader.js"></script>
    <script src="/flbo/cli/view/renderList.js"></script>
    <script src="/flbo/cli/view/renderDetail.js"></script>
    <script src="/flBo/cli/view/renderDetailTab.js"></script>
    <script src="/flbo/cli/view/renderModalList.js"></script>
    <script src="/flBo/cli/view/renderUpdate.js"></script>
    <script src="/flBo/cli/view/renderDocumentSection.js"></script>
    <script src="/flBo/cli/view/renderGlobalTable.js"></script>
    <script src="/flBo/cli/view/renderModalListHeader.js"></script>
    <script src="/flBo/cli/view/renderModalListForm.js"></script>
    <script src="/flBo/cli/view/renderModalListRows.js"></script>
    <script src="/flbo/cli/view/renderGroup.js"></script>
    <script src="/flBo/cli/view/renderGroupTabCards.js"></script>
    <script src="/flBo/cli/view/renderGroupTab.js"></script>

    <!-- TODO
    <script src="/flbo/cli/view/renderModalCalendar.js"></script>

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

    const searchCallback = () => {}
    const listCallback = () => {}
    const modalListCallback = () => {}
    const updateCallback = () => {}
 
    </script>

    </html>`
}

module.exports = {
    renderIndex
}
