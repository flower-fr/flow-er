import View from "../View.js"
import Global from "../global/Global.js"
import List from "../list/List.js"
import Navbar from "../navbar/Navbar.js"
import Search from "../search/Search.js"

export default class Layout extends View
{
    constructor({ controller, application, tab, entity, view, locale })
    {
        super({ controller })
        this.application = application
        this.tab = tab
        this.entity = entity
        this.view = view
        this.navbar = new Navbar({ controller, application, tab, locale })
        this.search = new Search({ controller, entity, view, locale })
        this.global = new Global({ controller, entity, view, locale })
        this.list = new List({ controller, entity, view, locale })
    }

    initialize = async () =>
    {
        await this.navbar.initialize()
        await this.search.initialize()
        await this.global.initialize()
        await this.list.initialize()
    }

    render = () =>
    {
        const html = []
    
        html.push(`
            <nav
                id="flSidenav"
                data-mdb-sidenav-init
                class="sidenav"
                data-mdb-mode="over"
                data-mdb-content="#content"
            >
                <div class="container">`)

        html.push(this.search.render())

        html.push(this.global.render())

        html.push(`
                </div>
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
                                <button data-mdb-ripple-init="" data-mdb-toggle="sidenav" data-mdb-target="#flSidenav" class="btn btn-primary" aria-controls="#flSidenav" aria-haspopup="true" aria-expanded="false">
                                    <i class="fas fa-bars"></i>
                                </button>
                            </div>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <div id="flShortcuts">
                            </div>

                        </section>

                        <div class="section">
                            <div class="row">`)
    
        html.push(this.list.render())

        html.push(`
                            </div>
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

    trigger = () =>
    {
        const sidenav = document.getElementById("flSidenav")
        new mdb.Sidenav(sidenav)

        this.navbar.trigger()
        this.search.trigger()
        this.list.trigger()

        const element = document.getElementById("flSearchButton")
        new mdb.Button(element)
    }
}