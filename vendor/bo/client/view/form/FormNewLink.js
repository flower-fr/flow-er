import View from "../View.js"
import Toast from "../toast/Toast.js"

export default class FormNewLink extends View
{
    constructor({ controller, id, propertyId, property, links, translations })
    {
        super({ controller })
        this.id = id
        this.propertyId = propertyId
        this.property = property
        this.links = links
        this.translations = translations
    }

    render = () =>
    {
        const html = []

        html.push(`
            <div class="input-group mb-1" id="flFormLinkOutline-${ this.propertyId }">
                <input
                    type="text"
                    class="form-control rounded"
                    id="flFormLinkName-${ this.propertyId }"
                />
                <button class="btn btn-warning" type="button" id="flFormLinkPlus-${ this.propertyId }" disabled data-mdb-ripple-init>
                    <i class="fas fa-plus"></i>                        
                </button>
            </div>`)

        return html.join("\n")
    }

    trigger = () =>
    {
        const { propertyId, property, links } = this
        
        const activateLinkPlus = () => {
            const name = document.getElementById(`flFormLinkName-${ propertyId }`).value
            if (!name) {
                document.getElementById(`flFormLinkPlus-${ propertyId }`).disabled = true
            } else if (links.find(x => x.name === name)) {
                document.getElementById(`flFormLinkPlus-${ propertyId }`).disabled = true
            } else {
                document.getElementById(`flFormLinkPlus-${ propertyId }`).disabled = false
            }
        }

        document.getElementById(`flFormLinkName-${ propertyId }`).addEventListener("change", activateLinkPlus)
        document.getElementById(`flFormLinkName-${ propertyId }`).addEventListener("keyup", activateLinkPlus)

        document.getElementById(`flFormLinkPlus-${ propertyId }`).addEventListener("click", () => {
            this.postHandler()
        })

        const data = Object.values(property.modalities).map(x => x.label)
        const el = document.getElementById(`flFormLinkOutline-${ propertyId }`)
        const dataFilter = (value) => {
            return data.filter((item) => {
                return item.toLowerCase().includes(value.toLowerCase())
            })
        }
        new mdb.Autocomplete(el, {
            filter: dataFilter,
            noResults: property.noResults,
        })
        el.addEventListener("itemSelect.mdb.autocomplete", e => {
            document.getElementById(`flFormLinkPlus-${ propertyId }`).disabled = false
        })
    }

    postHandler = async () =>
    {
        const { controller, id, propertyId, property, translations } = this
        const value = document.getElementById(`flFormLinkName-${ propertyId }`).value
        const fk = Number(Object.entries(property.modalities).find(([id, mod]) => (mod.label === value))[0])
        const properties = {}, def = {}
        properties[property.linkId] = id
        properties[propertyId] = fk
        def[property.linkId] = property.linkId
        def[propertyId] = propertyId
        const body = { 
            rows: [properties],
            steps: [{ id: "save", entity: property.linkEntity, properties: def }]
        }
        const response = await fetch(`/core/transaction/${ property.linkEntity }`, {
            method: "POST",
            headers: new Headers({"content-type": "application/json"}),
            body: JSON.stringify(body)
        })
    
        // Handle the response
        if (response.ok) {
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
