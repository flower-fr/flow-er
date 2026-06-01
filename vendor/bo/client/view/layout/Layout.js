import View from "../View.js"
import Global from "../global/Global.js"
import List from "../list/List.js"
import Navbar from "../navbar/Navbar.js"
import Search from "../search/Search.js"
import SearchKeywords from "../search/SearchKeywords.js"
import SidenavButton from "../search/SidenavButton.js"

export default class Layout extends View
{
    constructor({ controller, application, tab, entity, view, locale, theme })
    {
        super({ controller })
        this.application = application
        this.tab = tab
        this.entity = entity
        this.view = view
        this.locale = locale
        this.navbar = new Navbar({ controller, application, tab, locale, theme })
        this.search = new Search({ controller, entity, view, locale, layout: this })
        this.global = new Global({ controller, entity, view, locale })
        this.list = new List({ controller, entity, view, locale, layout: this })
        this.searchKeywords = new SearchKeywords({ controller, placeholder: "Nom, entreprise, coordonnées" })
        this.sidenavButton = new SidenavButton({ controller })
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
                        <section class="p-4 d-flex flex-wrap w-100" id="flShortcuts">
                            ${ this.sidenavButton.render() }
                            ${ this.searchKeywords.render() }
                        </section>

                        <div class="section">
                            <div class="row" id="flList">`)
    
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
        this.global.trigger()
        this.list.trigger()

        const element = document.getElementById("flSearchButton")
        new mdb.Button(element)
    }

    refreshList = async ({ where, orderProperty, orderDirection }) =>
    {
        if (orderProperty) {
            this.orderProperty = orderProperty
        }
        if (orderDirection) {
            this.orderDirection = orderDirection
        }
        const { controller, entity, view, locale } = this
        this.list = new List({ controller, entity, view, where, orderProperty: this.orderProperty, orderDirection: this.orderDirection, locale, layout: this })
        await this.list.initialize()
        document.getElementById("flList").innerHTML = this.list.render()
        this.list.trigger()
    }
}