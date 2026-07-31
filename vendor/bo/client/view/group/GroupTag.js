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
                class="chip chip-outline btn-outline-secondary mb-3"
                id="flGroupTag-${ this.name }"
                data-mdb-chip-init
                data-mdb-ripple-color="dark"
            >
                ${ this.name }&nbsp;&nbsp;<i class="fas fa-trash" id="flGroupShortcutClose-${ this.name }"></i>
            </div>`)

        return html.join("\n")
    }
}
