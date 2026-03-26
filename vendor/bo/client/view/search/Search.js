import View from "../View.js"
import SearchFilter from "./SearchFilter.js"

export default class Search extends View
{
    constructor({ controller, entity, view })
    {
        super({ controller })
        this.entity = entity
        this.view = view || "default"
    }

    initialize = async () =>
    {
        const response = await fetch(`/bo/search/${ this.entity }?view=${ this.view }`)
        const { properties, params, translations } = await response.json()
        this.properties = properties
        this.params = params
        this.translations = translations

        const filters = []
        for (const [propertyId, property] of Object.entries(properties)) {
            filters.push(new SearchFilter({ controller: this.controller, entity: this.entity, view: this.view, propertyId, property, params, translations }))
        }
        this.filters = filters
    }

    render = () =>
    {
        const html = []

        html.push(`
        <div class="container">
            <form class="form-inline">
                <div class="row mt-3">`)

        for (const filter of this.filters) html.push(filter.render())
    
        html.push(`
                    <div class="col-md-12">    
                        <div class="input-group mb-2 text-center">
                            <button type="button" class="btn btn-outline-primary" id="flSearchRefresh" title="${ this.translations["Refresh the list"] }">
                                <i class="fa fa-sync-alt"></i>
                            </button>
                            <button type="button" class="btn btn-outline-primary" id="flSearchErase" title="${ this.translations["Erase"] }">
                                <i class="fa fa-times"></i>
                            </button>                
                        </div>
                    </div>
                </div>
            </form>
        </div>`)

        return html.join("\n")
    }

    trigger = () =>
    {
        for (const filter of this.filters) {
            filter.trigger()
        }

        const refresh = document.getElementById("flSearchRefresh")
        new mdb.Ripple(refresh, { rippleColor: "primary" })

        const erase = document.getElementById("flSearchErase")
        new mdb.Ripple(erase, { rippleColor: "primary" })
    }
}
