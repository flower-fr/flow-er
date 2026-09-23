import View from "../View.js"
import Toast from "../toast/Toast.js"

export default class AddTag extends View
{
    constructor({ controller, entity, name, layout, translations })
    {
        super({ controller })
        this.entity = entity
        this.name = name
        this.layout = layout
        this.translations = translations
        this.checked = false
    }

    render = () =>
    {
        const html = []

        html.push(`
            <div
                class="chip chip-outline btn-outline-primary"
                id="flAddTag-${ this.name }-${ this.layout.screenIndex }"
                data-fl-checked="false"
                data-mdb-chip-init
                data-mdb-ripple-color="dark"
            >
                ${ this.name }
            </div>`)

        return html.join("\n")
    }

    async postHandler(newId)
    {
        if (this.checked) {
            const { controller, entity, name, layout, translations } = this
            const response = await fetch("/core/v1/tag", {
                method: "POST",
                headers: new Headers({"content-type": "application/json"}),
                body: JSON.stringify({ entity, name, rowIds: [newId] })
            })

            // Handle the response
            if (!response.ok) {
                console.error("AddTag submit error:", response.status, response.statusText)
                const toast = new Toast({ controller: controller }, {
                    title: translations["error"],
                    message: translations["technicalError"],
                    type: "danger",
                    persistent: true })
                toast.trigger()
            }
        }
    }
}
