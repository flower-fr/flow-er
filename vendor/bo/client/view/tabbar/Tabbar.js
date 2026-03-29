import View from "../View.js"
export default class Tabbar extends View
{
    constructor({ controller, entity, level, view })
    {
        super({ controller })
        this.entity = entity
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
                    ${ Object.entries(menu).map(([tabId, tab]) => `<li class="nav-item"><a class="nav-link ${ tabId === defaultTab ? "active" : ""}" id="flTab-${ tabId }">${ tab.label }</a></li>`).join("\n") }
                </ul>
                <div id="flTabPanel"></div>
            </div>`)

        return html.join("\n")
    }

    trigger = () => {}
}
