import View from "../View.js"
import { getTab } from "/flBo/cli/controller/getTab.js"

export default class Detail extends View
{
    constructor({ controller, context, entity, view, data, searchParams, callback })
    {
        super({ controller })
        this.context = context
        this.entity = entity
        this.view = view
        this.id = data.id
        this.tabs = data.detailConfig.tabs
        this.defaultTab = null
        this.searchParams = searchParams
        this.callback = callback

        for (const tab of Object.values(this.tabs)) {
            let route = ""
            if (tab.route) {
                route = `${tab.route}${ (this.id && this.id != 0) ? `/${this.id}` : ""}`
            }
            else {
                route = `/${tab.controller}/${tab.action}/${tab.entity}/${ (tab.id == "id") ? this.id : tab.id }`
            }
            if (route) {
                const query = []
                if (tab.query) {
                    for (let key of Object.keys(tab.query)) {
                        let value = tab.query[key]
                        if (key == "where") {
                            let map = []
                            for (let [key, val] of Object.entries(value)) {
                                if (val == "id") val = this.id
                                map.push(`${key}:${val}`)
                            }
                            value = map.join("|")
                        }
                        query.push(`${key}=${value}`)
                    }    
                }
                tab.route = route
                tab.query = query.join("&")
            }
        }
    }

    render = () =>
    {    
        const html = []

        html.push(`
        <div class="container">
            <ul class="nav nav-tabs">`)

        for (const [tabId, tab] of Object.entries(this.tabs)) {
            let condition = false
            if (!tab.condition) condition = true
            else {
                if (tab.condition[0] == "!" && this.id == 0) condition = true
                else if (this.id != 0) condition = true
            }

            if (condition) {

                html.push(`
                    <li class="nav-item"><a class="nav-link detailTab ${(!this.defaultTab) ? "active" : ""}" id="detailTab-${tabId}">${this.context.localize(tab.labels)}</a></li>`)

                html.push(`
                    <input class="${ (tab.renderer) ? tab.renderer : "renderUpdate" }" type="hidden" id="detailTabRoute-${tabId}" value="${tab.route}?${tab.query}" />
                    <input type="hidden" id="detailTabQuery-${tabId}" value="${tab.query}" />`)

                if (!this.defaultTab) this.defaultTab = tabId
            }
        }

        html.push(`
            </ul>
            <div id="detailPanel"></div>
        </div>`)

        return html.join("\n")
    }

    trigger = () =>
    {
        $(".detailTab").click(function () {
            const tabId = $(this).attr("id").split("-")[1]
            $(".detailTab").removeClass("active")
            $(this).addClass("active")
            const route = $(`#detailTabRoute-${tabId}`).val()

            getTab({ context, entity, view }, tabId, route, id, "", { ...this.searchParams }, null, this.callback)
        })
        const tab = this.defaultTab, tabRoute = `${ this.tabs[tab].route + "?"}?${this.tabs[tab].query}`
        const context = this.context, entity = this.entity, view = this.view, id = this.id
        getTab({ context, entity, view }, tab, tabRoute, id, "", { ...this.searchParams }, null, this.callback)
    }
}
