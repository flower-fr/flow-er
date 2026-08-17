import View from "../View.js"
import Dashboard from "../dashboard/Dashboard.js"
import AddForm from "../form/AddForm.js"
import Global from "../global/Global.js"
import Group from "../group/Group.js"
import List from "../list/List.js"
import Navbar from "../navbar/Navbar.js"
import Search from "../search/Search.js"
import SearchKeywords from "../search/SearchKeywords.js"
// import SidenavButton from "../search/SidenavButton.js"
import AlertsManager from "../toast/AlertsManager.js"

export default class Layout extends View
{
    constructor({ controller, application, tab, entity, view, locale, theme, profile_id })
    {
        super({ controller })
        this.application = application
        this.tab = tab
        this.entity = entity
        this.view = view
        this.locale = locale
        this.navbar = new Navbar({ controller, application, tab, locale, theme })
        this.search = new Search({ controller, entity, view, locale, layout: this })
        this.dashboard = new Dashboard({ controller, entity, view })
        this.addForm = new AddForm({ controller, entity, view, layout: this })
        this.global = new Global({ controller, entity, view, locale })
        this.searchKeywords = new SearchKeywords({ controller, placeholder: "Nom, entreprise, coordonnées", layout: this })
        // this.sidenavButton = new SidenavButton({ controller })
        this.group = new Group({ controller, entity, view, layout: this })
        this.list = new List({ controller, entity, view, group: this.group, layout: this })
        this.alertsManager = new AlertsManager({ controller, entity, view, profile_id })
    }

    initialize = async () =>
    {
        await this.navbar.initialize()
        await this.search.initialize()
        await this.dashboard.initialize()
        await this.addForm.initialize()
        await this.global.initialize()
        await this.list.initialize()
        await this.group.initialize()
        await this.alertsManager.initialize()
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

        // html.push(this.search.render())
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
                        <div class="col-md-9">
                            <div class="section">
                                <div class="row" id="flList">`)
        
        html.push(this.list.render())

        html.push(`
                                </div>
                            </div>
                        </div>
                            <div class="col-md-3" id="flRightColumn">`)
        
        html.push(this.dashboard.render())        
        html.push(this.group.render())
        html.push(this.addForm.render())
        html.push(`
                                <div class="card p-3 mb-3" id="flCard" style="display:none;"></div>`)

        html.push(`
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
        // this.search.trigger()
        this.global.trigger()
        this.searchKeywords.trigger()
        this.dashboard.trigger()
        this.group.trigger()
        // this.list.trigger()
        this.addForm.trigger()
        this.refreshList({ where: this.addForm.extractFilters(), tags: this.addForm.extractTags() })
        this.alertsManager.trigger()

        const element = document.getElementById("flSearchButton")
        new mdb.Button(element)
    }

    refreshList = async ({ where, tags, orderProperty, orderDirection }) =>
    {
        if (orderProperty) {
            this.orderProperty = orderProperty
        }
        if (orderDirection) {
            this.orderDirection = orderDirection
        }
        const { controller, entity, view, group } = this
        this.list = new List({ controller, entity, view, group, where, tags, orderProperty: this.orderProperty, orderDirection: this.orderDirection, layout: this })
        await this.list.initialize()
        document.getElementById("flList").innerHTML = this.list.render()
        this.list.trigger()
    }
}