import View from "../View.js"
import Form from "../form/Form.js"
import Card from "../card/Card.js"

export default class Tabbar extends View
{
    constructor({ controller, entity, id, level, view })
    {
        super({ controller })
        this.entity = entity
        this.id = id
        this.level = level
        this.view = view
    }

    initialize = async () =>
    {
        const response = await fetch(`/bo/tabbar/${ this.entity }/${ this.level }?view=${ this.view }`)
        const { menu, defaultTab, translations } = await response.json()
        this.menu = menu,
        this.defaultTab = defaultTab
        this.translations = translations
    }

    render = () =>
    {
        const html = [], menu = this.menu, defaultTab = this.defaultTab

        html.push(`
            <div class="container">
                <ul class="nav nav-tabs">
                    ${ Object.entries(menu).map(([tabId, tab]) => `
                        <li class="nav-item">
                            <a
                                data-mdb-tab-init
                                class="nav-link ${ tabId === defaultTab ? "active" : ""}"
                                id="flTab-${ tabId }"
                                href="#flPanel-${ tabId }"
                                role="tab"
                                aria-controls="flPanel-${ tabId }"
                                aria-selected="true"
                            >
                                ${ tab.label }
                            </a>
                        </li>`).join("\n") }
                </ul>
                <div class="tab-content">
                    ${ Object.entries(menu).map(([tabId]) => `
                    <div
                        class="tab-pane fade ${ tabId === defaultTab ? "show active" : ""}"
                        id="flPanel-${ tabId }"
                        role="tabpanel"
                        aria-labelledby="flTab-${ tabId }"
                    >
                        Lorem ipsum...${tabId}
                    </div>`).join("\n") }
                </div>
            </div>`)

        return html.join("\n")
    }

    getTab = async (tabId) => {
        const { controller, entity, id, view } = this, menu = this.menu, tab = menu[tabId]
        let component 
        if (tab.action === "card") component = new Card({ controller, entity, id, view })
        await component.initialize()
        const content = component.render()
        $(`#flPanel-${ tabId }`).html(content)
        component.trigger()
    }

    trigger = async () => {
        const getTab = this.getTab
        getTab(this.defaultTab)
        Object.entries(this.menu).map(([tabId]) =>
        {
            const tabTrigger = new mdb.Tab(document.querySelector(`#flTab-${ tabId }`))
            $(`#flTab-${ tabId }`).click(function (e) {
                tabTrigger.show()
                getTab(tabId)
            })
        })
    }
}
