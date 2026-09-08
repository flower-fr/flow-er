import View from "../View.js"
import Card from "../card/Card.js"

export default class Detail extends View
{
    constructor({ controller, entity, id, view, layout })
    {
        super({ controller })
        this.entity = entity
        this.id = id
        this.view = view
        this.layout = layout
    }

    initialize = async () =>
    {
        const response = await fetch(`/bo/detail/${ this.entity }?view=${ this.view }`)
        const { menu, defaultTab, translations } = await response.json()
        this.menu = menu,
        this.defaultTab = defaultTab
        this.translations = translations
    }

    render = () =>
    {
        const html = [], menu = this.menu, defaultTab = this.defaultTab, layout = this.layout

        html.push(`
            <div class="container">
                <ul class="nav nav-tabs">
                    ${ Object.entries(menu).map(([tabId, tab]) => `
                        <li class="nav-item">
                            <a
                                data-mdb-tab-init
                                class="nav-link ${ tabId === defaultTab ? "active" : ""}"
                                id="flTab-${ tabId }-${ layout.screenIndex }"
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
                        id="flPanel-${ tabId }-${ layout.screenIndex }"
                        role="tabpanel"
                        aria-labelledby="flTab-${ tabId }-${ layout.screenIndex }"
                    >
                        Lorem ipsum...${tabId}
                    </div>`).join("\n") }
                </div>
            </div>`)

        return html.join("\n")
    }

    getTab = async (tabId) => {
        const { controller, entity, id, view, layout } = this, menu = this.menu, tab = menu[tabId]
        let component 
        if (tab.action === "card") component = new Card({ controller, entity, id, view, layout: this.layout})
        await component.initialize()
        const content = component.render()
        $(`#flPanel-${ tabId }-${ layout.screenIndex }`).html(content)
        component.trigger()
    }

    trigger = async () => {
        const getTab = this.getTab, layout = this.layout
        getTab(this.defaultTab)
        Object.entries(this.menu).map(([tabId]) =>
        {
            const tabTrigger = new mdb.Tab(document.querySelector(`#flTab-${ tabId }-${ layout.screenIndex }`))
            $(`#flTab-${ tabId }-${ layout.screenIndex }`).click(function (e) {
                tabTrigger.show()
                getTab(tabId)
            })
        })
    }
}
