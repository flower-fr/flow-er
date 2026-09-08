import View from "../View.js"
import Dashboard from "../dashboard/Dashboard.js"
import AddForm from "../form/AddForm.js"
import Global from "../global/Global.js"
import Group from "../group/Group.js"
import List from "../list/List.js"
import Navbar from "../navbar/Navbar.js"
// import Search from "../search/Search.js"
import SearchKeywords from "../search/SearchKeywords.js"
// import SidenavButton from "../search/SidenavButton.js"
import AlertsManager from "../toast/AlertsManager.js"

export default class Layout extends View
{
    constructor({ controller, application, tab, entity, view, locale, theme, profile_id, stackView = false })
    {
        super({ controller })
        this.application = application
        this.tab = tab
        this.entity = entity
        this.view = view
        this.locale = locale
        this.theme = theme
        this.profile_id = profile_id
        this.stackView = stackView
        this.screenIndex = controller.nextScreenIndex()
    }
    
    initialize = async () =>
    {
        const { controller, application, tab, entity, view, locale, theme, profile_id, stackView } = this

        let response = await fetch(`/bo/acl/${ entity }?view=${ view }`)
        if (!response.ok) {
            console.error("Failed to load ACL for entity", entity, "and view", view)
            return
        }
        const acl = await response.json()
        this.acl = acl
        if (!acl || Object.keys(acl).length === 0) {
            console.error("No ACL found for entity", entity, "and view", view)
            return
        }

        const enabledActions = getEnabledActions(acl, view)
        this.enabledActions = enabledActions

        this.navbar = !stackView ? new Navbar({ controller, application, tab, locale, theme }) : null
        // this.search = new Search({ controller, entity, view, locale, layout: this })
        this.dashboard = enabledActions.includes("dashboard") ? new Dashboard({ controller, entity, view, layout: this }) : null
        this.addForm = enabledActions.includes("add") ? new AddForm({ controller, entity, view, layout: this }) : null
        this.global = enabledActions.includes("global") ? new Global({ controller, entity, view, locale, layout: this }) : null
        this.searchKeywords = new SearchKeywords({ controller, placeholder: "Nom, entreprise, coordonnées", layout: this })
        // this.sidenavButton = new SidenavButton({ controller })
        this.group = enabledActions.includes("group") ? new Group({ controller, entity, view, layout: this }) : null
        this.list = enabledActions.includes("list") ? new List({ controller, entity, view, group: this.group, layout: this }) : null
        this.alertsManager = enabledActions.includes("alert") ? new AlertsManager({ controller, entity, view, profile_id, layout: this }) : null
        await this.navbar?.initialize()
        // await this.search.initialize()
        await this.dashboard?.initialize()
        await this.addForm?.initialize()
        await this.global?.initialize()
        await this.list?.initialize()
        await this.group?.initialize()
        await this.alertsManager?.initialize()
    }

    render = () =>
    {
        const html = []
    
        html.push(`
            <nav
                id="flSidenav-${ this.screenIndex }"
                data-mdb-sidenav-init
                class="sidenav"
                data-mdb-mode="over"
                data-mdb-content="#content"
            >
                <div class="container">`)

        // html.push(this.search.render())

        html.push(`
                </div>
            </nav>
            <div class="col-md-12" id="content-${ this.screenIndex }">

                <!-- Navbar -->
                <div id="flNavbar-${ this.screenIndex }">`)

        if (this.navbar) html.push(this.navbar.render())
    
        html.push(`
                </div>
                <div class="m-3">
                    <div class="row">
                        <div class="col-md-9" id="flMainView-${ this.screenIndex }">
                            <div class="section">
                                <div class="row" id="flList-${ this.screenIndex }">`)
        
        if (this.list) html.push(this.list.render())

        html.push(`
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3" id="flRightColumn-${ this.screenIndex }">
                            <div class="row mb-3" id="flDashboard-${ this.screenIndex }">`)
        
        if (this.dashboard) html.push(this.dashboard.render())
        html.push(`
                            </div>
                            <div class="card" id="flGroup-${ this.screenIndex }">`)

        if (this.group) html.push(this.group.render())

        html.push(`
                            </div>
                            <div class="row" id="flAddForm-${ this.screenIndex }">`)

        if (this.addForm) html.push(this.addForm.render())

        html.push(`
                            </div>
                            <div class="card p-3 mb-3" id="flCard-${ this.screenIndex }" style="display:none;"></div>
                            <div class="row mt-3" id="flGlobal-${ this.screenIndex }">`)

        if (this.global) html.push(this.global.render())

        html.push(`
                            </div>
                        </div>
                    </div>
                </div>`)

        if (!this.stackView) html.push(`
                <!-- Footer -->
                <div id="flFooter-${ this.screenIndex }">
                </div>`)

        html.push(`
            </div>
        </div>`)

        return html.join("\n")
    }

    trigger = () =>
    {
        const sidenav = document.getElementById(`flSidenav-${ this.screenIndex }`)
        new mdb.Sidenav(sidenav)

        this.navbar?.trigger()
        // this.search.trigger()
        this.global?.trigger()
        this.searchKeywords.trigger()
        this.dashboard?.trigger()
        this.group?.trigger()
        // this.list.trigger()
        this.addForm?.trigger()
        this.refreshList({ where: this.addForm?.extractFilters(), tags: this.addForm?.extractTags() })
        this.alertsManager?.trigger()

        const element = document.getElementById(`flSearchButton-${ this.screenIndex }`)
        new mdb.Button(element)
    }

    refreshGroup = async () =>
    {
        const { controller, entity, view } = this
        this.group = new Group({ controller, entity, view, layout: this })
        await this.group.initialize()
        document.getElementById(`flGroup-${ this.screenIndex }`).innerHTML = this.group.render()
        this.group.trigger()
        this.list.group = this.group
        this.list.trigger()
        $(`#flGroup-${ this.screenIndex }`).show()
    }
    
    refreshList = async ({ where, tags, orderProperty, orderDirection }) =>
    {
        if (!where) where = this.addForm?.extractFilters()
        if (!tags) tags = this.addForm?.extractTags()
        if (orderProperty) {
            this.orderProperty = orderProperty
        }
        if (orderDirection) {
            this.orderDirection = orderDirection
        }
        const { controller, entity, view, group } = this
        this.list = new List({ controller, entity, view, group, where, tags, orderProperty: this.orderProperty, orderDirection: this.orderDirection, layout: this })
        await this.list.initialize()
        document.getElementById(`flList-${ this.screenIndex }`).innerHTML = this.list.render()
        this.list.trigger()
    }

    showMainMode = () =>
    {
        const dashboardEl = document.getElementById(`flDashboard-${ this.screenIndex }`)
        const globalEl = document.getElementById(`flGlobal-${ this.screenIndex }`)
        const groupEl = document.getElementById(`flGroup-${ this.screenIndex }`)
        const addEl = document.getElementById(`flAddForm-${ this.screenIndex }`)
        const cardEl = document.getElementById(`flCard-${ this.screenIndex }`)
        dashboardEl.style.display = "block"
        addEl.style.display = "block"
        globalEl.style.display = "block"
        groupEl.style.display = "none"
        cardEl.style.display = "none"
    }

    showGroupMode = () =>
    {
        const dashboardEl = document.getElementById(`flDashboard-${ this.screenIndex }`)
        const globalEl = document.getElementById(`flGlobal-${ this.screenIndex }`)
        const groupEl = document.getElementById(`flGroup-${ this.screenIndex }`)
        const addEl = document.getElementById(`flAddForm-${ this.screenIndex }`)
        const cardEl = document.getElementById(`flCard-${ this.screenIndex }`)
        dashboardEl.style.display = "none"
        addEl.style.display = "none"
        globalEl.style.display = "none"
        groupEl.style.display = "block"
        cardEl.style.display = "none"
    }

    showCardMode = () =>
    {
        const dashboardEl = document.getElementById(`flDashboard-${ this.screenIndex }`)
        const globalEl = document.getElementById(`flGlobal-${ this.screenIndex }`)
        const groupEl = document.getElementById(`flGroup-${ this.screenIndex }`)
        const addEl = document.getElementById(`flAddForm-${ this.screenIndex }`)
        const cardEl = document.getElementById(`flCard-${ this.screenIndex }`)
        dashboardEl.style.display = "none"
        addEl.style.display = "none"
        globalEl.style.display = "none"
        groupEl.style.display = "none"
        cardEl.style.display = "block"
    }
}

const getEnabledActions = (acl, view) => {
    const actions = new Set()

    for (const key of Object.keys(acl)) {
        const firstUnderscore = key.indexOf("_")
        const lastUnderscore = key.lastIndexOf("_")

        if (firstUnderscore === -1 || firstUnderscore === lastUnderscore) continue

        const action = key.slice(0, firstUnderscore)
        const keyView = key.slice(lastUnderscore + 1)

        if (keyView !== view) continue

        actions.add(action)
    }

    return [...actions]
}