import View from "../View.js"
import Toast from "../toast/Toast.js"

export default class FormLink extends View
{
    constructor({ controller, propertyId, linkEntity, id, link, name, translations })
    {
        super({ controller })
        this.propertyId = propertyId
        this.linkEntity = linkEntity
        this.id = id
        this.link = link
        this.name = name
        this.translations = translations
    }

    render = () =>
    {
        const html = []

        html.push(`
            <div
                class="chip chip-outline btn-outline-secondary mb-1"
                id="flFormLink-${ this.propertyId }-${ this.id }"
                data-mdb-chip-init
                data-mdb-ripple-color="dark"
            >
                ${ this.name }
                &nbsp;&nbsp;
                <i class="fas fa-trash" id="flFormRemoveLink-${ this.propertyId }-${ this.id }"></i>
            </div>`)

        return html.join("\n")
    }

    trigger = () =>
    {
        const el = document.getElementById(`flFormRemoveLink-${ this.propertyId }-${ this.id }`)
        el.addEventListener("click", () => {
            this.deleteHandler()
        })
    }

    async deleteHandler()
    {
        const { controller, linkEntity, id, translations } = this
        const response = await fetch(`/core/v1/${ linkEntity }`, {
            method: "DELETE",
            headers: new Headers({"content-type": "application/json"}),
            body: JSON.stringify([{ id }])
        })

        // Handle the response
        if (response.ok) {
            const toast = new Toast({ controller }, {
                title: translations["success"],
                message: translations["requestRegistered"],
                type: "success" })
            toast.trigger()
        } else {
            console.error("FormLink submit error:", response.status, response.statusText)
            const toast = new Toast({ controller: controller }, {
                title: translations["error"],
                message: translations["technicalError"],
                type: "danger",
                persistent: true })
            toast.trigger()
        }
    }
}
