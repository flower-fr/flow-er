import View from "../View.js"

export default class Layout extends View
{
    render()
    {
        const html = []
    
        html.push(`
            <nav
                id="flSidenav"
                data-mdb-sidenav-init
                class="sidenav"
                data-mdb-mode="push"
                data-mdb-content="#content"
            >
            </nav>
            <div class="col-md-12" id="content">

                <!-- Navbar -->
                <div id="flNavbar">
                </div>

                <div class="m-3">
                    <div class="row">
                        <section class="p-4 d-flex flex-wrap w-100">
                            <div>
                                <button type="button" class="btn btn-primary" id="flSearchButton" data-mdb-ripple-init>
                                    <i class="fas fa-bars"></i>
                                </button>
                            </div>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <div id="flShortcuts">
                            </div>

                        </section>

                        <div class="section" id="dataview">
                            <div class="row" id="flList">
                            </div>
                        </div>
                    </div>
                </div>
                                        
                <!-- Modal -->
                
                <div class="modal fade" id="flModal" tabindex="-1" role="dialog" data-backdrop="static" aria-labelledby="flModalLabel" aria-hidden="true">
                    <div class="modal-dialog modal-xl" role="document">
                        <div class="modal-content" id="flModal">
                        </div>
                    </div>
                </div>
               
                <!-- Footer -->
                <div id="flFooter"
                </div>
            </div>
        </div>`)

        $("body").html(html.join("\n"))
    }

    renderNavbar(navbar)
    {
        $("#flNavbar").html(navbar.render())
        navbar.trigger()
    }

    renderSearchView({ searchConfig, data })
    {

    }

    renderShortcutsView({ shortcutsConfig, data })
    {

    }

    renderListView({ listConfig, data })
    {

    }

    showModal({ modalConfig })
    {

    }

    renderTabs({ tabsConfig, data})
    {

    }

    renderPanel({ panelConfig, data })
    {

    }

    trigger = () =>
    {
        const element = document.getElementById("flSearchButton")
        new mdb.Button(element)
    }
}