import View from "../View.js"
import Toast from "../toast/Toast.js"

export default class GroupTag extends View
{
    constructor({ controller, entity, name, group, layout, translations })
    {
        super({ controller })
        this.entity = entity
        this.name = name
        this.group = group
        this.layout = layout
        this.translations = translations
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
                ${ this.name }
                &nbsp;&nbsp;
                <i class="fas fa-plus" id="flGroupAddTag-${ this.name }"></i>
                &nbsp;&nbsp;
                <i class="fas fa-trash" id="flGroupRemoveTag-${ this.name }"></i>
            </div>`)

        return html.join("\n")
    }

    trigger = () =>
    {
        let el = document.getElementById(`flGroupAddTag-${ this.name }`)
        el.addEventListener("click", () => {
            this.postHandler()
        })

        el = document.getElementById(`flGroupRemoveTag-${ this.name }`)
        el.addEventListener("click", () => {
            this.deleteHandler()
        })
    }

    async postHandler()
    {
        const { controller, entity, name, layout, translations } = this
        const response = await fetch("/core/v1/tag", {
            method: "POST",
            headers: new Headers({"content-type": "application/json"}),
            body: JSON.stringify({ entity, name, rowIds: this.group.checkedRows.map(x => x.id) })
        })

        // Handle the response
        if (response.ok) {
            layout.refreshGroup()
            const toast = new Toast({ controller }, {
                title: translations["success"],
                message: translations["requestRegistered"],
                type: "success" })
            toast.trigger()
        } else {
            console.error("GroupTag submit error:", response.status, response.statusText)
            const toast = new Toast({ controller: controller }, {
                title: translations["error"],
                message: translations["technicalError"],
                type: "danger",
                persistent: true })
            toast.trigger()
        }
    }

    async deleteHandler()
    {
        const { controller, entity, name, layout, translations } = this
        const response = await fetch("/core/v1/tag", {
            method: "DELETE",
            headers: new Headers({"content-type": "application/json"}),
            body: JSON.stringify({ entity, name, rowIds: this.group.checkedRows.map(x => x.id) })
        })

        // Handle the response
        if (response.ok) {
            layout.refreshGroup()
            const toast = new Toast({ controller }, {
                title: translations["success"],
                message: translations["requestRegistered"],
                type: "success" })
            toast.trigger()
        } else {
            console.error("GroupTag submit error:", response.status, response.statusText)
            const toast = new Toast({ controller: controller }, {
                title: translations["error"],
                message: translations["technicalError"],
                type: "danger",
                persistent: true })
            toast.trigger()
        }
    }
}
