import View from "../View.js"

export default class Global extends View
{
    constructor({ controller, entity, view })
    {
        super({ controller })
        this.entity = entity
        this.view = view || "default"
    }

    initialize = async () =>
    {
        const response = await fetch(`/bo/global/${ this.entity }?view=${ this.view }`)
        const { actions, translations } = await response.json()
        this.actions = actions
        this.translations = translations
    }

    render = () =>
    {
        const html = []

        if (this.actions) {
            html.push("<hr />")
            for (let action of Object.values(this.actions)) {
                html.push(
                    `<div class="col-md-12">    
                    <div class="input-group mb-2 text-center">
                        ${ ( !action.type || action.type == "modal" ) ? `
                        <button type="button" class="btn btn-outline-primary fl-global" data-route="${ (action.route) ? action.route : `/${action.controller}/${action.action}/${action.entity}${ (action.id) ? `/${action.id}` : "" }?${ (action.view) ? `view=${action.view}` : "" }${ (action.limit) ? `limit=${action.limit}` : "" }` }" data-mdb-target="#flGlobalModalForm" data-mdb-modal-init>
                            <i ${ (action.glyph) ? `class="fa ${action.glyph}` : "" }"></i> ${ action.label }
                        </button>` : `
                        <a type="button" class="btn btn-outline-primary" href="/${action.controller}/${action.action}/${action.entity}${ (action.id) ? `/${action.id}` : "" }?${ (action.view) ? `view=${action.view}` : "" }">
                            <i ${ (action.glyph) ? `class="fa ${action.glyph}` : "" }"></i> ${ action.label }
                        </a>` }
                    </div>
                </div>`
                )
            }    
        }

        return html.join("\n")
    }

    trigger = () =>
    {
    }
}
