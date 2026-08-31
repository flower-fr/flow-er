import View from "../View.js"
import Toast from "../toast/Toast.js"

export default class GroupNewTag extends View
{
    constructor({ controller, entity, name, group, tags, layout, translations })
    {
        super({ controller })
        this.entity = entity
        this.name = name
        this.group = group
        this.tags = tags
        this.layout = layout
        this.translations = translations
    }

    render = () =>
    {
        const html = []

        html.push(`
            <div class="input-group mb-3" id="flGroupOutline-tag">
                <input
                    type="text"
                    class="form-control rounded"
                    id="flGroupTagName"
                    placeholder="Créer un #tag"
                    aria-label="Créer un #tag"
                />
                <button class="btn btn-warning" type="button" id="flGroupTagPlus" disabled data-mdb-ripple-init>
                    <i class="fas fa-plus"></i>                        
                </button>
            </div>`)

        return html.join("\n")
    }

    trigger = () =>
    {
        const activateTagPlus = () => {
            const name = document.getElementById("flGroupTagName").value
            if (!name) {
                document.getElementById("flGroupTagPlus").disabled = true
            } else if (this.tags.find(x => x.name === name)) {
                document.getElementById("flGroupTagPlus").disabled = true
            } else {
                document.getElementById("flGroupTagPlus").disabled = false
            }
        }

        document.getElementById("flGroupTagName").addEventListener("change", activateTagPlus)
        document.getElementById("flGroupTagName").addEventListener("keyup", activateTagPlus)

        document.getElementById("flGroupTagPlus").addEventListener("click", () => {
            this.postHandler()
        })
    }

    postHandler = async () =>
    {
        const { controller, entity, layout, translations } = this
        const name = document.getElementById("flGroupTagName").value
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
}
