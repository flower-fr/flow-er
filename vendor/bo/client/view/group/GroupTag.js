import View from "../View.js"

export default class GroupTag extends View
{
    constructor({ controller, name })
    {
        super({ controller })
        this.name = name
    }

    render = () =>
    {
        const html = []

        html.push(`
            <div
                class="chip chip-outline btn-outline-warning mb-3"
                id="flSearchTag-${ this.name }"
                data-fl-checked="false"
                data-mdb-chip-init
                data-mdb-ripple-color="dark"
            >
                ${ this.name }&nbsp;&nbsp;<i class="fas fa-trash" id="flSearchShortcutClose-name"></i>
            </div>`)

        return html.join("\n")
    }
}
