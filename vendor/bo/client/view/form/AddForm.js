import View from "../View.js"
import Toast from "../toast/Toast.js"
import AddTag from "./AddTag.js"

export default class AddForm extends View
{
    constructor({ controller, entity, view, layout })
    {
        super({ controller })
        this.entity = entity
        this.view = view
        this.layout = layout
    }

    initialize = async () =>
    {
        const response = await fetch(`/bo/add/${ this.entity }?view=${ this.view }`)
        const { properties, searchKeywords, tags, iterators, identifier, posts, translations } = await response.json()
        this.properties = properties
        this.searchKeywords = searchKeywords
        this.iterators = iterators
        this.identifier = identifier
        this.posts = posts
        this.translations = translations

        this.tags = tags.map(tag => new AddTag({ controller: this.controller, name: tag.distinct_name }))
    }

    render = () =>
    {
        const html = []
        html.push(`
            <div class="card" id="flAdd">
                <div class="card-body">

                    ${ this.layout.searchKeywords.render(this.searchKeywords) }

                    <hr>

                    <form id="flAddForm">`)

        for (const [propertyId, property] of Object.entries(this.properties)) {
            
            if (property.type === "hidden") {
                html.push(`
                        <input type="hidden" id="flAdd-${propertyId}" value="" />`)
                        
            } else if (["select", "vector"].includes(property.type)) {
                html.push(`
                        <div class="form-outline mb-3" id="flAddOutline-${propertyId}">
                            <select class="form-select form-select-sm" id="flAdd-${propertyId}" data-mdb-size="sm" ${ property.required ? "required" : "" } >
                                <option />`)

                for (let [modalityId, modality] of Object.entries(property.modalities)) {
                    html.push(`<option value="${modalityId}" ${ modality.archive ? "disabled" : "" }>${modality.label}</option>`)
                }

                html.push(`
                            </select>
                            <label class="form-label select-label">${ property.required ? "* " : "" }${property.label}</label>
                        </div>`)

            } else if (property.type === "date") {
                html.push(`
                        <div class="form-outline mb-3" id="flAddOutline-${propertyId}" data-mdb-datepicker-init data-mdb-input-init>
                            <input class="form-control form-control-sm" id="flAdd-${propertyId}" ${ property.required ? "required" : "" } />
                            <label class="form-label select-label">${ property.required ? "* " : "" }${property.label}</label>
                        </div>`)

            } else if (["time", "duration"].includes(property.type)) {
                html.push(`
                        <div class="form-outline mb-3" id="flAddOutline-${propertyId}" data-mdb-timepicker-init data-mdb-input-init>
                            <input class="form-control form-control-sm" id="flAdd-${propertyId}" ${ property.required ? "required" : "" } />
                            <label class="form-label select-label">${ property.required ? "* " : "" }${property.label}</label>
                        </div>`)

            } else if (property.type === "email"){
                html.push(`
                        <div class="form-outline mb-3" id="flAddOutline-${propertyId}" data-mdb-input-init>
                            <input type="email" class="form-control form-control-sm" id="flAdd-${propertyId}" ${ property.required ? "required" : "" } />
                            <label class="form-label select-label">${ property.required ? "* " : "" }${property.label}</label>
                        </div>`)

            } else {
                html.push(`
                        <div class="form-outline mb-3" id="flAddOutline-${propertyId}" data-mdb-input-init>
                            <input type="text" class="form-control form-control-sm" id="flAdd-${propertyId}" ${ property.required ? "required" : "" } />
                            <label class="form-label" for="flAdd-${propertyId}">${ property.required ? "* " : "" }${property.label}</label>
                        </div>`)
            }
        }

        if (this.iterators) {

            html.push(`
                        ${ "<hr>" }`)

            for (const [key, iterator] of Object.entries(this.iterators)) {
                if (iterator.type === "dateRange") {
                    html.push(`
                        <div class="row mb-3">
                            <div class="col-md-4">
                                <div class="form-outline" id="flAddOutline-min_${ key }" data-mdb-datepicker-init data-mdb-input-init>
                                    <input class="form-control form-control-sm fl-add-iterator" id="flAddIterator-min_${ key }" value="${ new Date().toISOString().split("T")[0].split("-").reverse().join("/") }" />
                                    <label class="form-label select-label">${ iterator.label[0] }</label>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-outline" id="flAddOutline-max_${ key }" data-mdb-datepicker-init data-mdb-input-init>
                                    <input class="form-control form-control-sm fl-add-iterator" id="flAddIterator-max_${ key }" value="${ new Date().toISOString().split("T")[0].split("-").reverse().join("/") }" />
                                    <label class="form-label select-label">${ iterator.label[1] }</label>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-outline" id="flAddOutline-days_${ key }">
                                    <select class="form-select form-select-sm fl-add-iterator" id="flAddIterator-days_${ key }" data-mdb-size="sm" multiple>
                                        <option value="1">Lu</option>
                                        <option value="2">Ma</option>
                                        <option value="3">Me</option>
                                        <option value="4">Je</option>
                                        <option value="5">Ve</option>
                                        <option value="6">Sa</option>
                                        <option value="0">Di</option>`)

                    html.push(`
                                    </select>
                                    <label class="form-label select-label">${ iterator.label[2] }</label>
                                </div>
                            </div>
                        </div>`)
                }
            }
        }

        for (const [postId, post] of Object.entries(this.posts)) {
            html.push(`
                <div class="form-outline mb-3">
                    <div class="col-md-12">    
                        <div class="input-group text-center">
                            <button type="button" class="btn btn-outline-primary" id="flAddRefresh" title="${ this.translations["Refresh the list"] }">
                                <i class="fa fa-sync-alt"></i>
                            </button>
                            <button type="button" class="btn btn-outline-primary" id="flAddErase" title="${ this.translations["Erase"] }">
                                <i class="fa fa-times"></i>
                            </button>                

                            <button 
                                name="flAdd-${postId}" 
                                class="btn btn-sm btn-warning flAdd-tab-submit"
                                data-mdb-ripple-init
                                data-mdb-ripple-color="danger"
                                ${ (post.method) ? `data-fl-method="${post.method}"`: "" }
                                data-fl-controller="${post.controller}"
                                data-fl-action="${post.action}"
                                data-fl-entity="${post.entity}"
                                data-fl-transaction="${postId}">
                                    ${post.label} <span class="fl-add-count"></span>
                            </button>
                        </div>
                    </div>
                </div>`)
        }

        html.push(`
                    </form>
                    <hr>`)

        for (const tag of this.tags) html.push(tag.render())

        html.push(`
                </div>
            </div>`)

        return html.join("\n")
    }

    retrieveExistingData = async () =>
    {
        const filters = {}, columns = []
        for (const propertyId of this.identifier ? this.identifier : []) {
            columns.push(propertyId)
            const property = this.properties[propertyId]
            const input = document.getElementById(`flAdd-${ propertyId }`)
            if (input) {
                if (property.type === "date") {
                    const val = input.value
                    if (val) filters[propertyId] = val.substring(6, 10) + "-" + val.substring(3, 5) + "-" + val.substring(0, 2)
                } else if (property.type === "time") {
                    const val = input.value
                    if (val) filters[propertyId] = `startsWith,${ val }`
                } else if (property.type === "duration") {
                    const val = input.value
                    if (val) {
                        const [hours, minutes] = val.split(":").map(Number)
                        filters[propertyId] = hours * 60 + minutes
                    }
                } else {
                    if (input.value) filters[propertyId] = input.value
                }
            }
        }

        for (const key of this.iterators ? Object.keys(this.iterators) : []) {
            const filter = ["in"] 
            for (const entry of this.scope) {
                filter.push(entry[key])
            }
            if (filter.length > 1) {
                filters[key] = filter.join(",")
            }
        }

        const where = Object.entries(filters).map(([key, value]) => `${key}:${value}`).join("|")
        return await fetch(`/core/v1/${ this.entity }?where=${ where }&columns=${ columns }`)
    }

    triggerAddButton = () =>
    {
        const toAdd = []
        for (const entry of this.scope) {
            const exists = this.existing.some(row => {
                return Object.entries(entry).every(([key, value]) => row[key].startsWith(value))
            })
            if (!exists) {
                toAdd.push(entry)
            }
        }
        $(".fl-add-count").text((toAdd.length > 0) ? `(${ toAdd.length })` : "")

        let formComplete = true
        for (const [propertyId, property] of Object.entries(this.properties)) {
            if (property.required) {
                const input = document.getElementById(`flAdd-${ propertyId }`)
                if (!input.value) formComplete = false
            }
        }

        if (toAdd.length !== 0 && formComplete) {
            $(".fl-add-count").text(`(${ toAdd.length })`)
            $(".flAdd-tab-submit").attr("disabled", false)
        } else {
            $(".fl-add-count").text("")
            $(".flAdd-tab-submit").attr("disabled", true)
        }
    }

    triggerScopeChange = async () =>
    {
        this.scope = []
        for (const [key, iterator] of this.iterators ? Object.entries(this.iterators) : []) {
            if (iterator.type === "dateRange") {
                const min = document.getElementById(`flAddIterator-min_${ key }`).value
                const max = document.getElementById(`flAddIterator-max_${ key }`).value
                const days = Array.from(document.getElementById(`flAddIterator-days_${ key }`).selectedOptions).map(option => parseInt(option.value))
                if (min && max) {
                    const startDate = new Date(min.split("/").reverse().join("-"))
                    const endDate = new Date(max.split("/").reverse().join("-"))
                    for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
                        if (days.length === 0 || days.includes(d.getDay())) {
                            this.scope.push((res => { res[key] = d.toISOString().split("T")[0]; return res })({}))
                        }
                    }
                }
            }
        }
        const response = await this.retrieveExistingData()
        this.existing = (await response.json()).rows
        this.triggerAddButton()
    }

    trigger = async () =>
    {
        const {properties, iterators, identifier, posts, translations, controller, layout} = this
        const form = document.getElementById("flAddForm")

        // Initialize and trigger MDB components for each iterator
        this.triggerScopeChange()
        for (const [key, iterator] of iterators ? Object.entries(iterators) : []) {
            if (iterator.type == "dateRange") {
                let el = document.getElementById(`flAddOutline-min_${ key }`)
                new mdb.Datepicker(el,{ inline: true })
                el = document.getElementById(`flAddOutline-max_${ key }`)
                new mdb.Datepicker(el,{ inline: true })
                el = document.getElementById(`flAddIterator-days_${ key }`)
                new mdb.Select(el)
            }
        }

        // Trigger scope change
        for (const key of identifier ? identifier : []) {
            const property = properties[key] || iterators[key]
            let el
            if (property.type === "dateRange") {
                el = document.getElementById(`flAddOutline-min_${ key }`)
                el.addEventListener("change", this.triggerScopeChange)
                el.addEventListener("valueChanged.mdb.datepicker", this.triggerScopeChange)
                el = document.getElementById(`flAddOutline-max_${ key }`)
                el.addEventListener("change", this.triggerScopeChange)
                el.addEventListener("valueChanged.mdb.datepicker", this.triggerScopeChange)
                el = document.getElementById(`flAddOutline-days_${ key }`)
                el.addEventListener("change", this.triggerScopeChange)
            }
            else {
                el = document.getElementById(`flAddOutline-${ key }`)
                el.addEventListener("change", this.triggerScopeChange)
                if (["time", "duration"].includes(property.type)) {
                    el.addEventListener("valueChanged.mdb.timepicker", this.triggerScopeChange)
                } else if (property.type === "autocomplete") {
                    el.addEventListener("close.mdb.autocomplete", this.triggerScopeChange)
                }
            }
        }

        // Initialize MDB components for each property
        for (const [propertyId, property] of Object.entries(properties)) {
            if (["select", "vector"].includes(property.type)) {
                const el = document.getElementById(`flAdd-${ propertyId }`)
                new mdb.Select(el)
            } else if (property.type === "autocomplete") {
                const data = Object.values(property.modalities).map(x => x.label)
                const el = document.getElementById(`flAddOutline-${ propertyId }`)
                const dataFilter = (value) => {
                    return data.filter((item) => {
                        return item.toLowerCase().includes(value.toLowerCase())
                    })
                }
                new mdb.Autocomplete(el, {
                    filter: dataFilter,
                    noResults: property.noResults,
                })

                const setForeignKey = (value) => {
                    const matchs = Object.entries(property.modalities).find(([id, modality]) => modality.label === value ? id : null)
                    const id = matchs ? matchs[0] : ""
                    document.getElementById(`flAdd-${ property.foreignKey }`).value = id
                }
                el.addEventListener("itemSelect.mdb.autocomplete", (e) => {
                    setForeignKey(e.value)
                })
                document.getElementById(`flAdd-${ propertyId }`).addEventListener("change", (e) => {
                    setForeignKey(e.target.value)
                })

            } else if (property.type === "date") {
                const el = document.getElementById(`flAddOutline-${ propertyId }`)
                new mdb.Datepicker(el,{ inline: true })
            } else if (["time", "duration"].includes(property.type)) {
                const el = document.getElementById(`flAddOutline-${ propertyId }`)
                new mdb.Timepicker(el,{ format24: true, increment: true }) 
            } else {
                const el = document.getElementById(`flAddOutline-${ propertyId }`)
                new mdb.Input(el)
            }
        }

        // Handle form submission
        form?.addEventListener("submit", async (event) => {
            event.preventDefault()

            if (!form.checkValidity()) {
                form.classList.add("was-validated")
                return
            }

            // Build the request body
            const body = { status: "new" }
            for (const [propertyId, property] of Object.entries(properties)) {
                const input = document.getElementById(`flAdd-${ propertyId }`)
                if (property.type === "date") {
                    const val = input.value
                    body[propertyId] = val ? val.substring(6, 10) + "-" + val.substring(3, 5) + "-" + val.substring(0, 2) : ""
                } else if (property.type === "duration") {
                    const val = input.value
                    if (val) {
                        const [hours, minutes] = val.split(":").map(Number)
                        body[propertyId] = hours * 60 + minutes
                    } else {
                        body[propertyId] = 0
                    }
                } else {
                    body[propertyId] = input.value
                }
            }

            // Submit the form data

            const toAdd = []
            for (const entry of this.scope) {
                const exists = this.existing.some(row => {
                    return Object.entries(entry).every(([key, value]) => row[key].startsWith(value))
                })
                if (!exists) {
                    toAdd.push(entry)
                }
            }

            const rows = []
            for (const entry of toAdd) {
                const row = { ...body }
                for (const [key, value] of Object.entries(entry)) {
                    row[key] = value
                }
                rows.push(row)
            }
            const submit = event.submitter, postId = submit.name.split("-").slice(1).join("-"), post = posts[postId]
            const response = await fetch(`/${ post.controller }/${ post.action }/${ post.entity }`, {
                method: post.method,
                headers: new Headers({"content-type": "application/json"}),
                // body: JSON.stringify([body]),
                body: JSON.stringify({ rows, steps: post.steps }),
            })

            // Handle the response
            if (response.ok) {
                layout.refreshList({})
                // form.reset()
                const toast = new Toast({ controller: controller }, {
                    title: translations["Success"],
                    message: translations["Request registered"],
                    type: "success" })
                toast.trigger()
            } else {
                console.error("AddForm submit error:", response.status, response.statusText)
                const toast = new Toast({ controller: controller }, {
                    title: translations["Error"],
                    message: translations["Technical error, Please try again later"],
                    type: "danger",
                    persistent: true })
                toast.trigger()
            }
        })

        for (const tag of this.tags) {
            const tagElement = document.getElementById(`flAddTag-${ tag.name }`)
            tagElement.addEventListener("click", () => {
                let checked = tagElement.getAttribute("data-fl-checked")
                tagElement.setAttribute("data-fl-checked", (checked === "true") ? "false": "true")
                checked = (checked === "true") ? "false" : "true"
                tagElement.classList.remove((checked === "true") ? "btn-outline-primary" : "btn-outline-success")
                tagElement.classList.add((checked === "true") ? "btn-outline-success" : "btn-outline-primary")
                layout.refreshList({ where: this.extractFilters(), tags: this.extractTags() })
            })
        }

        // Quick keyword search
        const quickSearch = document.getElementById("flSearchKeywordsRefresh")
        new mdb.Ripple(quickSearch, { rippleColor: "primary" })
        quickSearch.addEventListener("click", () => {
            layout.refreshList({ where:`keywords:contains,${ document.getElementById("flSearchKeywords").value }`, tags: this.extractTags() })
        })
 
        const refresh = document.getElementById("flAddRefresh")
        new mdb.Ripple(refresh, { rippleColor: "primary" })
        refresh.onclick = () => {
            layout.refreshList({ where: this.extractFilters(), tags: this.extractTags() })
        }

        const erase = document.getElementById("flAddErase")
        new mdb.Ripple(erase, { rippleColor: "primary" })
        document.getElementById("flAddErase").onclick = () => {
            layout.refreshList({})
            for (const propertyId of Object.keys(properties)) {
                const instance = mdb.Select.getInstance(`#flAdd-${ propertyId }`)
                if (instance) instance.setValue("")
                else document.getElementById(`flAdd-${ propertyId }`).value = ""
                for (const tag of this.tags) {
                    const tagElement = document.getElementById(`flAddTag-${ tag.name }`)
                    tagElement.setAttribute("data-fl-checked", "false")
                    tagElement.classList.remove("btn-outline-success")
                    tagElement.classList.add("btn-outline-primary")
                }
            }
            this.buildShortcuts()
        }
    }

    extractFilters = () =>
    {
        const { properties, iterators } = this, filters = []

        for (const [key, iterator] of iterators ? Object.entries(iterators) : []) {
            if (iterator.type == "dateRange") {
                let min = document.getElementById(`flAddIterator-min_${ key }`).value
                if (min) min = moment(min, "DD/MM/YYYY").format("YYYY-MM-DD")
                let max = document.getElementById(`flAddIterator-max_${ key }`).value
                if (max) max = moment(max, "DD/MM/YYYY").format("YYYY-MM-DD")
                if (min && max) {
                    filters.push(`${ key }:between,${ min },${ max }`)
                } else if (min) {
                    filters.push(`${ key }:>=,${ min }`)
                } else if (max) {
                    filters.push(`${ key }:<=,${ max }`)
                }
            }
        }

        for (const [propertyId, property] of Object.entries(properties)) {
            const value = document.getElementById(`flAdd-${ propertyId }`).value
            if (value) {
                filters.push(`${ propertyId }:contains,${ value }`)
            }
        }
        return filters.join("|")
    }

    extractTags = () =>
    {
        const tags = this.tags.filter(tag => document.getElementById(`flAddTag-${ tag.name }`).getAttribute("data-fl-checked") === "true").map(tag => tag.name)
        return tags.join(",")
    }
}
