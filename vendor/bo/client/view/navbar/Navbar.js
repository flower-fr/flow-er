import View from "../View.js"
export default class Navbar extends View
{
    constructor({ controller, application, tab })
    {
        super({ controller })
        this.application = application
        this.tab = tab
    }

    initialize = async () =>
    {
        const response = await fetch(`/bo/navbar/${ this.application }/${ this.tab }`)
        const { logo, logoHeight, helpMenu, instance, user, menu, defaultTab, translations } = await response.json()
        this.logo = logo
        this.logoHeight = logoHeight || "40"
        this.helpMenu = helpMenu
        this.instance = instance
        this.user = user
        this.defaultTab = defaultTab
        this.menu = menu,
        this.translations = translations
    }

    render = () =>
    {
        const html = [], menu = this.menu

        html.push(`
            <header>
                <nav class="navbar navbar-expand-lg bg-body-tertiary">
                    <div class="container-fluid">
                        <button 
                        data-mdb-collapse-init
                        class="navbar-toggler"
                        type="button"
                        data-mdb-target="#navbarSupportedContent"
                        aria-controls="navbarSupportedContent"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                        >
                            <span class="navbar-toggler-icon"></span>
                        </button>

                        <!-- Collapsible wrapper -->
                        <div class="collapse navbar-collapse" id="navbarSupportedContent">

                            <a class="navbar-brand" href="#">`)
        
        if (this.logo) {
            html.push(`<img height="${ this.logoHeight }" src="/${`logos/${ this.logo }`}" alt="${ this.title }" title="${ this.title }" />`)
        } else {
            html.push(`<span>${this.instance.label}&nbsp;&nbsp;|</span>`)
        }

        html.push(`
                            </a>

                            <!-- Left links -->
                            <ul class="navbar-nav me-auto mb-2 mb-lg-0">`)

        html.push(this.renderEntries({ menu }))

        html.push(`
                            </ul>
                        </div>

                        <!-- Right elements -->

                        <div class="d-flex align-items-center">
                            <div class="dropdown">
                                <a
                                data-mdb-dropdown-init
                                class="link-secondary me-3 dropdown-toggle hidden-arrow"
                                href="#"
                                id="navbarDropdownMenuLink"
                                role="button" 
                                data-mdb-ripple-init
                                aria-expanded="false"
                                >
                                    <span class="far fa-lg fa-user"></span>
                                </a>
                                <ul class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                                    <li><a class="dropdown-item" href="#">${ this.user.n_fn }</a></li>
                                    <li><a class="dropdown-item" href="/user/change-password">${ this.translations["Change password"] }</a></li>
                                </ul>
                            </div>`)

        html.push(`
                            <div>
                                <a href="/user/logout" class="link-secondary text-danger" title="${ this.translations["Log out"] }">
                                    <i class="fa-solid fa-lg fa-right-from-bracket"></i>
                                </a>
                            </div>

                        </div>
                    </div>
                </nav>
            </header>`)

        return html.join("\n")
    }

    renderEntries = ({ menu }) => 
    {
        const html = []
        for (let [menuTabId, menuTab] of Object.entries(menu)) {
            const params = menuTab.params ? `/${ Object.values(menuTab.params).map(value => value).join("/") }` : ""
            const query = menuTab.query ? `?${Object.entries(menuTab.query).map(([key, value]) => `${key}=${value}`).join("&")}` : ""
            const route = `/${ menuTab.controller }/${ menuTab.action }${ params }${ query }`

            html.push(`<li class="nav-item">
                <a class="nav-link ${ menuTabId === this.defaultTab ? "active" : "" } ${ menuTab.disabled ? "btn disabled" : ""}" href="${route}" id="${menuTabId}-anchor">
                    ${ menuTab.label }
                </a>
            </li>`)
        }
        return html.join("\n")
    }

    trigger = () => {
        if (mdb) {
            const element = document.getElementById("navbarDropdownMenuLink")
            new mdb.Dropdown(element)
        }
    }
}
