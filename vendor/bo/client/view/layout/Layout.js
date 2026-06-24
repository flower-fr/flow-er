import View from "../View.js"
import Dashboard from "../dashboard/Dashboard.js"
import AddForm from "../form/AddForm.js"
import Global from "../global/Global.js"
import Group from "../group/Group.js"
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
        this.dashboard = new Dashboard({ controller, entity, view })
        this.addForm = new AddForm({ controller, entity, view, layout: this })
        this.global = new Global({ controller, entity, view, locale })
        this.list = new List({ controller, entity, view, locale, layout: this })
        this.searchKeywords = new SearchKeywords({ controller, placeholder: "Nom, entreprise, coordonnées" })
        this.sidenavButton = new SidenavButton({ controller })
        this.group = new Group({ controller, entity, view, layout: this })
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

<div
  class="toast show fade mx-auto"
  id="static-example"
  role="alert"
  aria-live="assertive"
  aria-atomic="true"
  data-mdb-toast-init
  data-mdb-color="success"
  data-mdb-autohide="false"
>
  <div class="toast-header">
    <strong class="me-auto">Todo list</strong>
    <small>17 juin</small>
    <button type="button" class="btn-close" data-mdb-dismiss="toast" aria-label="Close"></button>
  </div>
  <div class="toast-body">Voici la liste des personnes à contacter ce jour. C’est à votre portée!</div>
</div>
                
                <div class="m-3">
                    <div class="row">
                        <div class="col-md-9">
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
                            <div class="col-md-3" id="flRightColumn">`)
        
        html.push(this.dashboard.render())        
        html.push(this.group.render())
        html.push(this.addForm.render())

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
        this.search.trigger()
        this.global.trigger()
        this.dashboard.trigger()
        this.group.trigger()
        this.list.trigger()
        this.addForm.trigger()

        const element = document.getElementById("flSearchButton")
        new mdb.Button(element)

        const el = document.getElementById("static-example")
        new mdb.Toast(el)
        let instance = mdb.Toast.getInstance(document.getElementById("static-example"))
        instance.update({ position: "top-right", })
    }

    refreshList = async ({ where, tags, orderProperty, orderDirection }) =>
    {
        if (orderProperty) {
            this.orderProperty = orderProperty
        }
        if (orderDirection) {
            this.orderDirection = orderDirection
        }
        const { controller, entity, view, locale } = this
        this.list = new List({ controller, entity, view, where, tags, orderProperty: this.orderProperty, orderDirection: this.orderDirection, locale, layout: this })
        await this.list.initialize()
        document.getElementById("flList").innerHTML = this.list.render()
        this.list.trigger()
    }
}