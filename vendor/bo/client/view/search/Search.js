import View from "../View.js"
import SearchFilter from "./SearchFilter.js"
import SearchTag from "./SearchTag.js"
import Shortcut from "./Shortcut.js"

export default class Search extends View
{
    constructor({ controller, entity, view, locale, layout })
    {
        super({ controller })
        this.entity = entity
        this.view = view || "default"
        this.locale = locale
        this.layout = layout
    }

    initialize = async () =>
    {
        const response = await fetch(`/bo/search/${ this.entity }?view=${ this.view }&locale=${this.locale}`)
        const { properties, params, tags, translations } = await response.json()
        this.properties = properties
        this.params = params
        this.translations = translations

        const filters = []
        for (const [propertyId, property] of Object.entries(properties)) {
            filters.push(new SearchFilter({ controller: this.controller, entity: this.entity, view: this.view, propertyId, property, params, translations }))
        }
        this.filters = filters

        this.tags = tags.map(tag => new SearchTag({ controller: this.controller, name: tag.distinct_name }))
    }

    render = () =>
    {
        const html = []

        html.push(`
        <div class="row my-3">
            <div class="col-md-12 my-3">    
                <a
                    href="#!"
                    class="text-primary"
                    data-mdb-toggle="sidenav" data-mdb-target="#flSidenav"
                    aria-controls="#flSidenav"
                >
                    <i class="fas fa-arrow-left"></i>
                </a>
            </div>`)

        for (const filter of this.filters) html.push(filter.render())
    
        html.push(`
            <div class="col-md-12">    
                <div class="input-group text-center">
                    <button type="button" class="btn btn-outline-primary" id="flSearchRefresh" title="${ this.translations["Refresh the list"] }">
                        <i class="fa fa-sync-alt"></i>
                    </button>
                    <button type="button" class="btn btn-outline-primary" id="flSearchErase" title="${ this.translations["Erase"] }">
                        <i class="fa fa-times"></i>
                    </button>                
                </div>
            </div>
        </div>`)

        for (const tag of this.tags) html.push(tag.render())

        return html.join("\n")
    }

    buildShortcuts = () =>
    {
        const { controller, layout, properties } = this
        document.getElementById("flShortcuts").innerHTML = layout.sidenavButton.render()
        document.getElementById("flShortcuts").insertAdjacentHTML("beforeend", layout.searchKeywords.render())

        // Quick keyword search
        document.getElementById("flSearchKeywordsRefresh").addEventListener("click", () => {
            layout.refreshList({ where:`keywords:contains,${ document.getElementById("flSearchKeywords").value }`, tags: this.extractTags() })
        })

        for (const [propertyId, property] of Object.entries(properties)) {
            if (["date", "time", "datetime", "number"].includes(property.type)) {
                if (document.getElementById(`flSearchMin-${propertyId}`).value || document.getElementById(`flSearchMax-${propertyId}`).value) {
                    const shortcut = new Shortcut({ controller, propertyId, property: properties[propertyId] })
                    document.getElementById("flShortcuts").insertAdjacentHTML("beforeend", shortcut.render())

                    // Close shortcut
                    document.getElementById(`flSearchShortcutClose-${ propertyId }`).addEventListener("click", () => {
                        document.getElementById(`flSearchMin-${ propertyId }`).value = ""
                        document.getElementById(`flSearchMax-${ propertyId }`).value = ""
                        this.buildShortcuts()
                        layout.refreshList({ where: this.extractFilters(), tags: this.extractTags() })
                    })
                }
            } else {
                if (document.getElementById(`flSearch-${ propertyId }`).value) {
                    const shortcut = new Shortcut({ controller, propertyId, property: properties[propertyId] })
                    document.getElementById("flShortcuts").insertAdjacentHTML("beforeend", shortcut.render())

                    // Close shortcut
                    document.getElementById(`flSearchShortcutClose-${ propertyId }`).addEventListener("click", () => {
                        const instance = mdb.Select.getInstance(`#flSearch-${ propertyId }`)
                        if (instance) instance.setValue("")
                        else document.getElementById(`flSearch-${ propertyId }`).value = ""
                        this.buildShortcuts()
                        layout.refreshList({ where: this.extractFilters(), tags: this.extractTags() })
                    })
                }
            }
        }

        for (const tag of this.tags) {
            const tagElement = document.getElementById(`flSearchTag-${ tag.name }`)
            if (tagElement.getAttribute("data-fl-checked") === "true") {
                const shortcut = new Shortcut({ controller, propertyId: `tag:${ tag.name }`, property: { label: `#${ tag.name }` } })
                document.getElementById("flShortcuts").insertAdjacentHTML("beforeend", shortcut.render())

                // Close shortcut
                document.getElementById(`flSearchShortcutClose-tag:${ tag.name }`).addEventListener("click", () => {
                    tagElement.setAttribute("data-fl-checked", "false")
                    this.buildShortcuts()
                    layout.refreshList({ where: this.extractFilters(), tags: this.extractTags() })
                })
            }
        }
    }

    extractFilters = () =>
    {
        const { properties } = this, filters = []
        for (const [propertyId, property] of Object.entries(properties)) {
            if (["date", "time", "datetime", "number"].includes(property.type)) {
                let min = document.getElementById(`flSearchMin-${ propertyId }`).value
                if (min) min = moment(min, "DD/MM/YYYY").format("YYYY-MM-DD")
                let max = document.getElementById(`flSearchMax-${ propertyId }`).value
                if (max) max = moment(max, "DD/MM/YYYY").format("YYYY-MM-DD")
                if (min && max) {
                    filters.push(`${ propertyId }:between,${ min },${ max }`)
                } else if (min) {
                    filters.push(`${ propertyId }:>=,${ min }`)
                } else if (max) {
                    filters.push(`${ propertyId }:<=,${ max }`)
                }
            } else {
                const value = document.getElementById(`flSearch-${ propertyId }`).value
                if (value) {
                    filters.push(`${ propertyId }:contains,${ value }`)
                }
            }
        }
        return filters.join("|")
    }

    extractTags = () =>
    {
        const tags = this.tags.filter(tag => document.getElementById(`flSearchTag-${ tag.name }`).getAttribute("data-fl-checked") === "true").map(tag => tag.name)
        return tags.join(",")
    }

    trigger = () =>
    {
        const { layout, properties } = this

        this.buildShortcuts()

        for (const filter of this.filters) {
            filter.trigger()
        }

        for (const tag of this.tags) {
            const tagElement = document.getElementById(`flSearchTag-${ tag.name }`)
            tagElement.addEventListener("click", () => {
                tagElement.setAttribute("data-fl-checked", "true")
                layout.refreshList({ where: this.extractFilters(), tags: this.extractTags() })
                this.buildShortcuts()
            })
        }

        const refresh = document.getElementById("flSearchRefresh")
        new mdb.Ripple(refresh, { rippleColor: "primary" })

        const erase = document.getElementById("flSearchErase")
        new mdb.Ripple(erase, { rippleColor: "primary" })

        document.getElementById("flSearchRefresh").onclick = () => {
            layout.refreshList({ where: this.extractFilters(), tags: this.extractTags() })
            this.buildShortcuts()
        }

        document.getElementById("flSearchErase").onclick = () => {
            layout.refreshList({})
            for (const [propertyId, property] of Object.entries(properties)) {
                if (["date", "time", "datetime", "number"].includes(property.type)) {
                    document.getElementById(`flSearchMin-${ propertyId }`).value = ""
                    document.getElementById(`flSearchMax-${ propertyId }`).value = ""
                } else {
                    const instance = mdb.Select.getInstance(`#flSearch-${ propertyId }`)
                    if (instance) instance.setValue("")
                    else document.getElementById(`flSearch-${ propertyId }`).value = ""
                }
                for (const tag of this.tags) {
                    const tagElement = document.getElementById(`flSearchTag-${ tag.name }`)
                    tagElement.setAttribute("data-fl-checked", "false")
                }
            }
            this.buildShortcuts()
        }
    }
}
