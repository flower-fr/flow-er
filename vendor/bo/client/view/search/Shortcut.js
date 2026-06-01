import View from "../View.js"
export default class Shortcut extends View
{
    constructor({ controller, search, propertyId, property })
    {
        super({ controller })
        this.search = search
        this.propertyId = propertyId
        this.property = property
    }

    render = () =>
    {
        const { propertyId, property } = this, html = []

        html.push(`
            <div class="chip chip-outline btn-outline-primary" id="flSearchShortcut-${propertyId}">
                ${ property.label }&nbsp;&nbsp;<i class="fas fa-times" id="flSearchShortcutClose-${propertyId}"></i>
            </div>`)

        return html.join("\n")
    }
}
