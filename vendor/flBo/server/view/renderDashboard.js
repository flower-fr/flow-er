const moment = require("moment")

const { renderHead } = require("./renderHead")
const { renderHeader } = require("./renderHeader")
const { renderFooter } = require("./renderFooter")
const { renderSearchInput } = require("./renderSearchInput")

const renderDashboard = ({ context, entity, view }, data) => {

    console.log("In renderDashboard (flBo)")
    
    const tab = data.tab, indexConfig = data.indexConfig, dashboardConfig = data.dashboardConfig

    const html = []

    html.push(`
    <!DOCTYPE html>
    <html lang="fr" ${ (tab.darkMode) ? "data-mdb-theme=\"dark\"" : "" }>
    
    ${ renderHead({ context, entity, view }, data) }
    
    <body>    
        <div class="row">
            <div class="col-md-2" id="flNavModal" tabindex="-1" role="dialog" data-backdrop="static" aria-labelledby="flNavModalLabel" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-body" id="sidenav"></div>
                    </div>
                </div>
            </div>

            <div class="col-md-12" id="content">

                <!-- Header -->
                <div id="headerDiv">
                    ${renderHeader({ context, entity, view }, data)}
                </div>

                <div class="m-3">
                    <div class="row">
                        <div class="col-md-10">                    
                            <section class="p-4 d-flex flex-wrap w-100">
                                <div>
                                    <button class="btn btn-primary" id="flSearchButton">
                                        <i class="fas fa-bars"></i>
                                    </button>
                                </div>
                                &nbsp;&nbsp;&nbsp;&nbsp;
                                
                                ${ (indexConfig) ? renderSearchInput({ context, entity, view }, indexConfig) : "" }

                            </section>`)

    html.push(`
                            <div class="row d-flex justify-content-center">
                                <div class="col-md-8">
                                    <div class="calendar" id="calendar">
                                        <div class="calendar-tools">
                                            <div class="d-flex flex-column flex-lg-row justify-content-center align-items-center">
                                                <span class="calendar-heading" id="flTaskHeaderText">Du ${ moment().subtract(1, "days").format("DD MMM") } au ${ moment().add(1, "days").format("DD MMM") } </span>
                                            </div>
                                            <div class="d-flex justify-content-center">
                                                <button class="btn btn-primary fl-task-add" type="button" data-bs-toggle="modal" data-bs-target="#flModal">Ajouter une tâche</button>
                                            </div>
                                        </div>
                                        <table class="list">
                                            <thead>
                                                <tr></tr>
                                            </thead>
                                            <tbody id="flList"></tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>`)
                        
    html.push(`
                        </div>
                        <div class="col-md-2">`)

    let i = 0
    for (const section of dashboardConfig.right) {

        const mapper = ([x, y]) => {
            if (y === "month") y = ["startsWith", moment().format("YYYY-MM")]
            else if (y === "month-1") y = ["startsWith", moment().subtract(1, "month").format("YYYY-MM")]
            else if (y === "year") y = ["startsWith", moment().format("YYYY")]

            return `${x}:${y}`
        }
            
        html.push(`
                            <div 
                                class="section fl-dataview"
                                data-fl-entity="${ section.entity }"
                                data-fl-label="${ context.localize(section.labels) }"
                                data-fl-identifier="${ i++ }"
                                data-fl-where="${ Object.entries(section.where).map(mapper).join("|") }"
                            ></div>`)
    }

    html.push(`
                        </div>
                    </div>
                </div>
            </div>
                        
            <!-- detailModal -->
            
            <div class="modal fade" id="flModal" tabindex="-1" role="dialog" data-backdrop="static" aria-labelledby="flModalLabel" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content" id="flModalContent">
                    </div>
                </div>
            </div>

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

    <script src="/flBo/cli/resources/jquery/jquery-3.6.3.min.js" ></script>
    <script src="/flBo/cli/resources/popper/popper.min.js"></script>
    <script src="/flBo/cli/resources/bootstrap-5.3.3-dist/js/bootstrap.bundle.min.js"></script>
    <script src="/flBo/cli/resources/jquery-ui-1.13.2/jquery-ui.js"></script>
    <script src="/flBo/cli/resources/jquery.timepicker/jquery.timepicker.js"></script>
    <script src="/flBo/cli/resources/toastr/build/toastr.min.js"></script>
    <script src="/flBo/cli/resources/json-viewer/jquery.json-viewer.js"></script>
    <script src="/bo/cli/resources/moment/moment-with-locales.min.js"></script>

    <script src="/flBo/cli/view/renderSearch.js"></script>
    <script src="/flBo/cli/view/renderTasks.js"></script>
    <script src="/flBo/cli/view/renderTaskAdd.js"></script>
    <script src="/flBo/cli/view/renderTaskDetail.js"></script>
 
    <script type="module" src="/flBo/cli/controller/loadDashboard.js" data-json="${ encodeURI(JSON.stringify({ "entity": entity, "view": view }, dashboardConfig)) }" id="module-script"></script>
    <script>
    
        $("#flNavModal").hide()

        const showSearch = () => {
            $("#content").removeClass("col-md-12").addClass("col-md-10")
            $("#flNavModal").show()
            $("#flSearchButton").click(hideSearch)
        }

        const hideSearch = () => {
            $("#flNavModal").hide()
            $("#content").removeClass("col-md-10").addClass("col-md-12")
            $("#flSearchButton").click(showSearch)
        }

        $("#flSearchButton").click(showSearch)

        const mdb=false
        const getSearchRoute = () => { return "/flBo/search/${ entity }?view=${ view }" }
        const searchRenderer = renderSearch

        const getListRoute = () => { return "/flBo/list/${ entity }?view=${ view }" }
        const listRenderer = renderTasks

        const dashboardCallback = () => {}
        const searchCallback = () => {}
        const tasksCallback = () => {}
        const listCallback = () => {}
        const modalListCallback = () => {}
        const updateCallback = () => {}

    </script>

    </html>`)

    return html.join("\n")
}

module.exports = {
    renderDashboard
}
