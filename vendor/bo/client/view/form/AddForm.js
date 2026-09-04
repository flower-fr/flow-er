import View from "../View.js"
import Toast from "../toast/Toast.js"
import AddTag from "./AddTag.js"
import computeCalendar from "../../utils/computeCalendar.js"

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
        const { properties, layout, data, searchKeywords, tags, identifier, iterators, posts, translations } = await response.json()
        this.properties = properties
        this.columnLayout = layout
        this.calendars = data.calendar && data.calendar[1].calendar
        this.searchKeywords = searchKeywords
        this.identifier = identifier
        this.iterators = iterators
        this.posts = posts
        this.translations = translations

        for (const property of Object.values(properties)) {
            if (property.type === "date") {
                property.frame = property.defaultFrame
            }
        }

        this.tags = tags.map(tag => new AddTag({ controller: this.controller, name: tag.distinct_name }))
    }

    render = () =>
    {
        const html = [], { properties, columnLayout, searchKeywords, posts, translations } = this
        html.push(`
            <div class="card" id="flAdd">
                <div class="card-body">

                    ${ this.layout.searchKeywords.render(searchKeywords) }

                    <hr>

                    <form id="flAddForm">`)

        for (const propertyId of Object.keys(columnLayout ? columnLayout : properties)) {
            const property = properties[propertyId]
            const options = columnLayout ? columnLayout[propertyId] : {}
            const initialValue = (options.initialValue === "today") ? moment().format("DD/MM/YYYY") : options.initialValue

            if (property.type === "hidden") {
                html.push(`
                        <input type="hidden" id="flAdd-${propertyId}" value="${ initialValue }" />`)
                        
            } else if (["select", "vector"].includes(property.type)) {
                html.push(`
                        <div class="form-outline mb-3" id="flAddOutline-${propertyId}">
                            <select class="form-select form-select-sm" id="flAdd-${propertyId}" data-mdb-size="sm" ${ property.required ? "required" : "" } ${ property.multiple ? "multiple" : "" } >
                                ${ !property.multiple ? "<option />" : "" }`)

                for (let [modalityId, modality] of Object.entries(property.modalities)) {
                    html.push(`<option value="${modalityId}" ${ modality.archive ? "disabled" : "" } ${ modalityId === initialValue ? "selected" : "" }>${modality.label}</option>`)
                }

                html.push(`
                            </select>
                            <label class="form-label select-label">${ property.required ? "* " : "" }${property.label}</label>
                        </div>`)

            } else if (property.type === "date") {
                html.push(`
                        <div class="row mb-3">
                            <div class="col-md-4">
                                <div class="form-outline" id="flAddOutline-${ propertyId }" data-mdb-datepicker-init data-mdb-input-init>
                                    <input class="form-control form-control-sm" id="flAdd-${ propertyId }" value="${ initialValue }" />
                                    <label class="form-label select-label">${ property.required ? "* " : "" }${property.label}</label>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="input-group text-center">
                                    <span title="${ translations["Day"] }" title="${ translations["Day"] }">
                                        <a id="flAdd-d_${ propertyId }" href="#!" class="${ property.frame === "day" ? "text-info" : "text-primary" }">
                                            <i class="fas fa-calendar-day"></i>
                                        </a>
                                    </span>
                                    &nbsp;&nbsp;
                                    <span title="${ translations["Week"] }" title="${ translations["Week"] }">
                                        <a id="flAdd-w_${ propertyId }" href="#!" class="${ property.frame === "week" ? "text-info" : "text-primary" }">
                                            <i class="fas fa-calendar-week"></i>
                                        </a>
                                    </span>
                                    &nbsp;&nbsp;
                                    <span title="${ translations["Month"] }" title="${ translations["Month"] }">
                                        <a id="flAdd-m_${ propertyId }" href="#!" class="${ property.frame === "month" ? "text-info" : "text-primary" }">
                                            <i class="fas fa-calendar-days"></i>
                                        </a>
                                    </span>
                                    &nbsp;&nbsp;
                                    <span title="${ translations["Year"] }" title="${ translations["Year"] }">
                                        <a id="flAdd-y_${ propertyId }" href="#!" class="${ property.frame === "year" ? "text-info" : "text-primary" }">
                                            <i class="fas fa-calendar"></i>
                                        </a>
                                    </span>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-outline" id="flAddOutline-days_${ propertyId }">
                                    <select class="form-select form-select-sm" id="flAdd-days_${ propertyId }" data-mdb-size="sm" multiple>
                                        <option value="1">Lu</option>
                                        <option value="2">Ma</option>
                                        <option value="3">Me</option>
                                        <option value="4">Je</option>
                                        <option value="5">Ve</option>
                                        <option value="6">Sa</option>
                                        <option value="0">Di</option>
                                    </select>
                                    <label class="form-label select-label">Jours</label>
                                </div>
                            </div>
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

        html.push(`
            <div class="form-outline mb-3">
                <div class="col-md-12">    
                    <div class="input-group text-center">
                        <button type="button" class="btn btn-outline-primary" id="flSearchRefresh" title="${ translations["Refresh the list"] }">
                            <i class="fa fa-sync-alt"></i>
                        </button>
                        <button type="button" class="btn btn-outline-primary" id="flSearchErase" title="${ translations["Erase"] }">
                            <i class="fa fa-times"></i>
                        </button>`)

        for (const [postId, post] of Object.entries(posts)) {
            html.push(`
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
                        </button>`)
        }

        html.push(`
                        </div>
                    </div>
                </div>
            </form>`)

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
                    const filter = ["in"] 
                    for (const entry of this.scope) {
                        filter.push(entry[propertyId])
                    }
                    if (filter.length > 1) {
                        filters[propertyId] = filter.join(",")
                    }
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

        const where = Object.entries(filters).map(([key, value]) => `${key}:${value}`).join("|")
        const response = await fetch(`/core/v1/${ this.entity }?where=${ where }&columns=${ columns }`)
        return (await response.json()).rows
    }

    triggerAddButton = () =>
    {
        const toAdd = []
        for (const entry of this.scope) {
            const exists = (this.existing || []).some(row => {
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

        for (const propertyId of this.iterators) {
            const property = this.properties[propertyId]
            if (property.type === "date") {
                const value = document.getElementById(`flAdd-${ propertyId }`).value
                if (value) {
                    const days = Array.from(document.getElementById(`flAdd-days_${ propertyId }`).selectedOptions).map(option => parseInt(option.value))
                    const scope = computeCalendar(moment(value, "DD/MM/YYYY").format("YYYY-MM-DD"), property.frame, this.calendars, days)
                    for (const date of scope) {
                        this.scope.push((res => { res[propertyId] = date; return res })({}))
                    }
                }
            }
            else {
                const value = document.getElementById(`flAdd-${ propertyId }`).value
                if (value) {
                    this.scope.push((res => { res[propertyId] = value; return res })({}))
                }
            }
        }

        this.existing = await this.retrieveExistingData()
        this.triggerAddButton()
    }

    trigger = async () =>
    {
        const {properties, identifier, posts, translations, controller, layout} = this

        const searchRefresh = document.getElementById("flSearchRefresh")
        const btnAnimation = new mdb.Animate(searchRefresh, {
            animation: "fade-in",
            animationStart: "manually",
            animationDuration: 1000,
            animationRepeat: true,
        })
        
        const keywordsRefresh = document.getElementById("flSearchKeywordsRefresh")
        
        const switcher = (propertyId, newFrame) => {
            ["flAdd-d_", "flAdd-w_", "flAdd-m_", "flAdd-y_"].forEach(prefix => {
                const element = document.getElementById(`${ prefix }${ propertyId }`)
                if (element) {
                    if (newFrame && prefix === `flAdd-${ newFrame[0] }_`) {
                        element.classList.remove("text-primary")
                        element.classList.add("text-info")
                    } else {
                        element.classList.remove("text-info")
                        element.classList.add("text-primary")
                    }
                }
            })
        }

        // Search refresh and erase

        const refresh = document.getElementById("flSearchRefresh")
        new mdb.Ripple(refresh, { rippleColor: "primary" })
        refresh.onclick = () => {
            searchRefresh.classList.remove("btn-primary")
            searchRefresh.classList.add("btn-outline-primary")
            btnAnimation.stopAnimation()
            keywordsRefresh.classList.remove("btn-primary")
            keywordsRefresh.classList.add("btn-outline-primary")
            document.getElementById("flSearchKeywords").value = ""

            layout.refreshList({ where: this.extractFilters(), tags: this.extractTags() })
        }

        const erase = document.getElementById("flSearchErase")
        new mdb.Ripple(erase, { rippleColor: "primary" })
        document.getElementById("flSearchErase").onclick = () => {

            searchRefresh.classList.remove("btn-primary")
            searchRefresh.classList.add("btn-outline-primary")
            btnAnimation.stopAnimation()
            keywordsRefresh.classList.remove("btn-primary")
            keywordsRefresh.classList.add("btn-outline-primary")

            layout.refreshList({})
            for (const [propertyId, property] of Object.entries(properties)) {
                if (["select", "vector"].includes(property.type)) {
                    const instance = mdb.Select.getInstance(`#flAdd-${ propertyId }`)
                    instance.setValue("")
                    instance.dispose()
                    new mdb.Select(document.getElementById(`flAdd-${ propertyId }`))

                } else if (property.type === "autocomplete") {
                    document.getElementById(`flAdd-${ propertyId }`).value = ""
                    const instance = mdb.Autocomplete.getInstance(`#flAddOutline-${ propertyId }`)
                    instance.dispose()
                    new mdb.Autocomplete(document.getElementById(`flAddOutline-${ propertyId }`))

                } else if (property.type === "date") {
                    document.getElementById(`flAdd-${ propertyId }`).value = ""
                    document.getElementById(`flAdd-days_${ propertyId }`)
                    const instance = mdb.Select.getInstance(`#flAdd-days_${ propertyId }`)
                    instance.setValue("")
                    instance.dispose()
                    new mdb.Select(document.getElementById(`flAdd-days_${ propertyId }`))
                    switcher(propertyId, property.defaultFrame)

                } else if (["time", "duration"].includes(property.type)) {
                    document.getElementById(`flAdd-${ propertyId }`).value = ""

                } else {
                    document.getElementById(`flAdd-${ propertyId }`).value = ""
                }
            }
            for (const tag of this.tags) {
                const tagElement = document.getElementById(`flAddTag-${ tag.name }`)
                tagElement.setAttribute("data-fl-checked", "false")
                tagElement.classList.remove("btn-outline-success")
                tagElement.classList.add("btn-outline-primary")
            }
            document.getElementById("flSearchKeywords").value = ""
        }

        // Initialize and trigger MDB components for each property
        this.triggerScopeChange()

        // Trigger scope change
        for (const key of identifier ? identifier : []) {
            const property = properties[key]
            let el
            if (property.type === "date") {
                el = document.getElementById(`flAddOutline-${ key }`)
                el.addEventListener("change", this.triggerScopeChange)
                el.addEventListener("valueChanged.mdb.datepicker", this.triggerScopeChange)
                el = document.getElementById(`flAdd-days_${ key }`)
                el.addEventListener("change", this.triggerScopeChange)
            } else {
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
            if (property.type === "select") {
                const el = document.getElementById(`flAdd-${ propertyId }`)
                new mdb.Select(el)
                el.addEventListener("change", () => {
                    searchRefresh.classList.remove("btn-outline-primary")
                    searchRefresh.classList.add("btn-primary")
                    btnAnimation.startAnimation()
                })
            }
            else if (property.type === "vector") {
                const el = document.getElementById(`flAdd-${ propertyId }`)
                new mdb.Select(el)

                if (property.foreignIdentifier) {
                    const setLabel = (selected) => {
                        const match = Object.entries(property.modalities).find(([id]) => id === selected)
                        const label = match ? match[1].label : ""
                        document.getElementById(`flAdd-${ property.foreignIdentifier }`).value = label
                    }
                    el.addEventListener("change", () => {
                        searchRefresh.classList.remove("btn-outline-primary")
                        searchRefresh.classList.add("btn-primary")
                        btnAnimation.startAnimation()
                        setLabel(document.getElementById(`flAdd-${ propertyId }`).value)
                    })
                }
            }
            else if (property.type === "autocomplete") {
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
                    const matchs = Object.entries(property.modalities).find(([id, modality]) => (modality.label === value) ? id : null)
                    const id = matchs ? matchs[0] : ""
                    const el = document.getElementById(`flAdd-${ property.foreignKey }`)
                    if (el) el.value = id
                }
                el.addEventListener("itemSelect.mdb.autocomplete", (e) => {
                    searchRefresh.classList.remove("btn-outline-primary")
                    searchRefresh.classList.add("btn-primary")
                    btnAnimation.startAnimation()
                    setForeignKey(e.value)
                })
                document.getElementById(`flAdd-${ propertyId }`).addEventListener("change", (e) => {
                    searchRefresh.classList.remove("btn-outline-primary")
                    searchRefresh.classList.add("btn-primary")
                    btnAnimation.startAnimation()
                    setForeignKey(e.target.value)
                })
            }
            else if (property.type === "date") {
                let el = document.getElementById(`flAddOutline-${ propertyId }`)
                el.addEventListener("valueChanged.mdb.datepicker", () => {
                    searchRefresh.classList.remove("btn-outline-primary")
                    searchRefresh.classList.add("btn-primary")
                    btnAnimation.startAnimation()
                })
                document.getElementById(`flAdd-${ propertyId }`).addEventListener("change", () => {
                    searchRefresh.classList.remove("btn-outline-primary")
                    searchRefresh.classList.add("btn-primary")
                    btnAnimation.startAnimation()
                })

                const datePickerOptions = {
                    inline: true,
                }
                if (property.mdb) {
                    datePickerOptions.datepicker = { 
                        format: property.mdb.dateFormat
                    }
                    datePickerOptions.monthsFull = property.mdb.monthsFull
                    datePickerOptions.weekdaysNarrow = property.mdb.weekdaysNarrow
                }
                new mdb.Datepicker(el, datePickerOptions)

                el = document.getElementById(`flAdd-days_${ propertyId }`)
                new mdb.Select(el)
                el.addEventListener("change", () => {
                    searchRefresh.classList.remove("btn-outline-primary")
                    searchRefresh.classList.add("btn-primary")
                    btnAnimation.startAnimation()
                })
                
                const frames = ["day", "week", "month", "year"]
                frames.forEach(prefix => {
                    const element = document.getElementById(`flAdd-${ prefix[0] }_${ propertyId }`)
                    if (element) {
                        element.addEventListener("click", () => {
                            searchRefresh.classList.remove("btn-outline-primary")
                            searchRefresh.classList.add("btn-primary")
                            btnAnimation.startAnimation()
                            property.frame = prefix
                            switcher(propertyId, prefix)
                            this.triggerScopeChange()
                        })
                    }
                })
            }
            else if (["time", "duration"].includes(property.type)) {
                const el = document.getElementById(`flAddOutline-${ propertyId }`)
                el.addEventListener("valueChanged.mdb.timepicker", () => {
                    searchRefresh.classList.remove("btn-outline-primary")
                    searchRefresh.classList.add("btn-primary")
                    btnAnimation.startAnimation()
                })
                new mdb.Timepicker(el,{ format24: true, increment: true }) 
            }
            else {
                const el = document.getElementById(`flAddOutline-${ propertyId }`)
                document.getElementById(`flAdd-${ propertyId }`).addEventListener("change", () => {
                    searchRefresh.classList.remove("btn-outline-primary")
                    searchRefresh.classList.add("btn-primary")
                    btnAnimation.startAnimation()
                })
                new mdb.Input(el)
            }
        }

        // Handle form submission
        const form = document.getElementById("flAddForm")
        form?.addEventListener("submit", async (event) => {
            event.preventDefault()

            const submit = event.submitter, postId = submit.name.split("-").slice(1).join("-"), post = posts[postId]

            const toAdd = []
            for (const entry of this.scope) {
                const exists = (this.existing || []).some(row => {
                    return Object.entries(entry).every(([key, value]) => row[key].startsWith(value))
                })
                if (!exists) {
                    toAdd.push(entry)
                }
            }

            // Build the request body
            let body = { status: "new" }
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
            if (post.action === "transaction") {
                const rows = []
                for (const entry of toAdd) {
                    const row = { ...body }
                    for (const [key, value] of Object.entries(entry)) {
                        row[key] = value
                    }
                    rows.push(row)
                }
                body = JSON.stringify({ rows, steps: post.steps })
            } else {
                body = JSON.stringify([body])
            }

            const response = await fetch(`/${ post.controller }/${ post.action }/${ post.entity }`, {
                method: post.method,
                headers: new Headers({"content-type": "application/json"}),
                body,
            })

            // Handle the response
            if (response.ok) {
                layout.refreshList({})
                // form.reset()
                const toast = new Toast({ controller: controller }, {
                    title: translations["success"],
                    message: translations["requestRegistered"],
                    type: "success" })
                toast.trigger()
            } else {
                console.error("AddForm submit error:", response.status, response.statusText)
                const toast = new Toast({ controller: controller }, {
                    title: translations["error"],
                    message: translations["technicalError"],
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
    }

    extractFilters = () =>
    {
        const { properties, columnLayout } = this, filters = []
        for (const propertyId of Object.keys(columnLayout ? columnLayout : properties)) {
            const property = properties[propertyId]
            const options = columnLayout ? columnLayout[propertyId] : {}
            const initialValue = (options.initialValue === "today") ? moment().format("DD/MM/YYYY") : options.initialValue
            if (property.type === "hidden") {
                if (initialValue) {
                    filters.push(`${ propertyId }:${ initialValue }`)
                }
            }
            else {
                if (property.type === "date") {

                    // Date interval depending on selected frame
                    const value = document.getElementById(`flAdd-${ propertyId }`).value
                    if (value) {
                        if (property.frame === "week") {
                            const startOfWeek = moment(value, "DD/MM/YYYY").startOf("week").format("YYYY-MM-DD")
                            const endOfWeek = moment(value, "DD/MM/YYYY").endOf("week").format("YYYY-MM-DD")
                            filters.push(`${ propertyId }:between,${ startOfWeek },${ endOfWeek }`)
                        } else if (property.frame === "month") {
                            const startOfMonth = moment(value, "DD/MM/YYYY").startOf("month").format("YYYY-MM-DD")
                            const endOfMonth = moment(value, "DD/MM/YYYY").endOf("month").format("YYYY-MM-DD")
                            filters.push(`${ propertyId }:between,${ startOfMonth },${ endOfMonth }`)
                        } else if (property.frame === "year") {
                            const startOfYear = moment(value, "DD/MM/YYYY").subtract(7, "months").startOf("year").add(7, "months").format("YYYY-MM-DD")
                            const endOfYear = moment(value, "DD/MM/YYYY").subtract(7, "months").endOf("year").add(7, "months").format("YYYY-MM-DD")
                            filters.push(`${ propertyId }:between,${ startOfYear },${ endOfYear }`)
                        }
                        else {
                            const formattedValue = moment(value, "DD/MM/YYYY").format("YYYY-MM-DD")
                            filters.push(`${ propertyId }:${ property.frame },${ formattedValue }`)
                        }
                    }

                    // Days of week
                    const dow = Array.from(document.getElementById(`flAdd-days_${ propertyId }`).selectedOptions)
                    if (dow.length > 0) {
                        filters.push(`${ property.dayOfWeekProperty }:in,${ dow.map(option => parseInt(option.value)).join(",") }`)
                    }
                } else if (["select", "vector", "time"].includes(property.type)) {
                    const value = document.getElementById(`flAdd-${ propertyId }`).value
                    if (value) {
                        filters.push(`${ propertyId }:${ value }`)
                    }
                } else if (property.type === "duration") {
                    const value = document.getElementById(`flAdd-${ propertyId }`).value
                    if (value) {
                        const [hours, minutes] = value.split(":").map(Number)
                        filters.push(`${ propertyId }:${ hours * 60 + minutes }`)
                    }
                } else {
                    const value = document.getElementById(`flAdd-${ propertyId }`).value
                    if (value) {
                        filters.push(`${ propertyId }:contains,${ value }`)
                    }
                    else if (property.defaultWhere) {
                        filters.push(`${ propertyId}:${ property.defaultWhere }`)
                    }
                }
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
