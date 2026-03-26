import View from "../View.js"
import Navbar from "../navbar/Navbar.js"
import Search from "../search/Search.js"

export default class Layout extends View
{
    constructor({ controller, application, tab, entity, view })
    {
        super({ controller })
        this.application = application
        this.tab = tab
        this.entity = entity
        this.view = view
        this.navbar = new Navbar({ controller, application, tab })
        this.search = new Search({ controller, entity, view })
    }

    initialize = async () =>
    {
        await this.navbar.initialize()
        await this.search.initialize()
    }

    render = () =>
    {
        const html = []
    
        html.push(`
            <nav
                id="flSidenav"
                data-mdb-sidenav-init
                class="sidenav"
                data-mdb-mode="push"
                data-mdb-content="#content"
            >`)

        html.push(this.search.render())

        html.push(`
            </nav>
            <div class="col-md-12" id="content">

                <!-- Navbar -->
                <div id="flNavbar">`)

        html.push(this.navbar.render())
    
        html.push(`
                </div>

                <div class="m-3">
                    <div class="row">
                        <section class="p-4 d-flex flex-wrap w-100">
                            <div>
                                <button data-mdb-ripple-init="" data-mdb-toggle="sidenav" data-mdb-target="#flSidenav" class="btn btn-primary" aria-controls="#flSidenav" aria-haspopup="true" style="" aria-expanded="false">
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

        return html.join("\n")
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
        const sidenav = document.getElementById("flSidenav")
        new mdb.Sidenav(sidenav)

        this.navbar.trigger()

        this.search.trigger()

        const element = document.getElementById("flSearchButton")
        new mdb.Button(element)
    }
}