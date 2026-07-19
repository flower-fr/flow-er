import View from "../View.js"

import ListHeader from "./ListHeader.js"
import ListGroup from "./ListGroup.js"
import ListRow from "./ListRow.js"
import Card from "../card/Card.js"

export default class List extends View
{
    constructor({ controller, entity, view, where, tags, orderProperty, orderDirection, layout })
    {
        super({ controller })
        this.entity = entity
        this.view = view || "default"
        this.where = where
        this.tags = tags || ""
        this.orderProperty = orderProperty
        this.orderDirection = orderDirection
        this.layout = layout
    }

    initialize = async () =>
    {
        // Retrieve the config and params
        let response = await fetch(`/bo/list/${ this.entity }?view=${ this.view }`)
        const { properties, identifier, params, sumable, translations } = await response.json()
        this.properties = properties
        this.identifier = identifier
        this.translations = translations
        this.sumable = sumable

        // Retrieve the data
        const columns = Object.keys(properties).join(",")
        let where = this.where
        const tags = this.tags
        if (!where && !tags) where = ((params.where) ? Object.entries(params.where).map(([k, v]) => `${ k }:${ v }`).join("|") : [])
        let orderProperty, orderDirection
        if (this.orderProperty) {
            orderProperty = this.orderProperty
            orderDirection = this.orderDirection
        } else {
            orderProperty = Object.keys(params.order)[0]
            orderDirection = params.order[orderProperty]
        }
        const order = this.orderProperty ? `${ (this.orderDirection === "desc") ? "-" : "" }${ this.orderProperty }` : Object.entries(params.order).map(([k, v]) => `${ v === "desc" ? "-" : "" }${ k }`).join("|")

        const limit = params.limit
        response = await fetch(`/core/v1/${ this.entity }?columns=${ columns }&where=${ where }&tags=${ tags }&order=${ order }${ limit ? `&limit=${ limit }` : "" }`)
        const rows = (await response.json()).rows
        this.rows = rows
        this.filledColumns = []
        if (orderProperty) this.filledColumns.push(this.orderProperty)
        this.rows.forEach(row => {
            Object.keys(row).forEach(column => {
                if (row[column] && row[column].toString().trim()) {
                    if (!this.filledColumns.includes(column)) this.filledColumns.push(column)
                }
            })
        })
        this.listHeader = new ListHeader({ controller: this.controller, rows, filledColumns: this.filledColumns, properties, orderProperty, orderDirection, limit, translations, layout: this.layout })
        let i = 0

        // Group rows by order property
        this.groups = [], this.listRows = []
        let currentPrefix, currentGroup
        const orderType = this.properties[orderProperty].type
        for (const row of rows) {
            const pred = (orderType === "datetime") ? () => row[orderProperty].substr(0, 7) !== currentPrefix?.substr(0, 7) : () => row[orderProperty] !== currentPrefix
            if (pred()) {
                currentPrefix = row[orderProperty]
                currentGroup = [new ListGroup({ controller: this.controller, value: row[orderProperty], size: Object.entries(row).length, translations })]
                this.groups.push(currentGroup)
            }
            const listRow = new ListRow({ i: i++, controller: this.controller, row, filledColumns: this.filledColumns, properties, translations })
            currentGroup.push(listRow)
            this.listRows.push(listRow)
        }

        // this.listRows = rows.map(row => { 
        //     return new ListRow({ i: i++, controller: this.controller, row, filledColumns: this.filledColumns, properties, translations })
        // })
        this.checkedIds = new Set()
    }

    render = () =>
    {    
        const html = [], translations = this.translations

        html.push(`
        <style>
        th {
            position: sticky;
            top: 0;
            z-index: 10;
        }
        .table-responsive {
            max-height: 100vh;
            overflow-y: auto;
        }
        </style>
        <div class="table-responsive">
            <div class="col-md-12">
                <table class="table table-sm table-hover" id="flListTable">
                    <thead class="fl-list">
                        ${ this.listHeader.render() }
                    </thead>
                    <tbody class="table-group-divider">`)

        this.groups.forEach(group => group.map(listRow => html.push(listRow.render())).join("\n"))
        // this.listRows.map(listRow => html.push(listRow.render())).join("\n")

        html.push(`
                        <tr class="listRow">
                            <td>
                                <div class="text-center">
                                    <input type="checkbox" id="flListCheckAllDown" data-toggle="tooltip" data-placement="top" title="${ translations["Check all"] }"></input>
                                </div>
                            </td>

                            <td class="text-center">
                                ${(this.listRows.length === this.limit) 
        ? `
                                    <button type="button" class="btn btn-sm btn-outline-primary fl-list-more" data-toggle="tooltip" data-placement="top" title="${ translations["Display the entire list"] }">
                                        <i class="fas fa-ellipsis-h"></i>
                                    </button>`
        : ""}
                            </td>

                            <td colspan="${Object.keys(this.properties).length}" />
                        </tr>`)

        html.push(`
                    </tbody>
                </table>
            </div>
        </div>`)

        return html.join("\n")
    }

    trigger = () =>
    {
        const controller = this.controller, entity = this.entity, view = this.view, translations = this.translations, layout = this.layout
        const tableEl = document.getElementById("flListTable")
        const cardEl = document.getElementById("flCard")
        const dashboardEl = document.getElementById("flDashboard")
        const groupEl = document.getElementById("flGroup")
        const addEl = document.getElementById("flAdd")

        this.listHeader.trigger()

        this.listRows.forEach(x => x.trigger())

        // Extend the displayed list

        $(".fl-list-more").click(function () {
            $("#flListLimitHidden").val(this.data.limit * 2)
            // triggerList({ context, entity, view })
        })

        // Enable card action
        this.rows.forEach(row => {
            document.getElementById(`flListDetail-${row.id}`)?.addEventListener("click", async (el) => {
                if (!cardEl) return
                const tr = el.target.closest("tr")

                // If the card is already open for this row, close it
                if (cardEl.dataset.openId === String(row.id)) {
                    cardEl.style.display = "none"
                    cardEl.innerHTML = ""
                    cardEl.dataset.openId = ""
                    if (groupEl.style.display === "none") {
                        dashboardEl.style.display = "block"
                        addEl.style.display = "block"
                    }
                    tr?.classList.remove("table-active", "fw-bold")
                    tableEl.classList.add("table-hover")
                    return
                }

                // Handle the display of others side elements
                if (groupEl.style.display === "none") dashboardEl.style.display = "block"
                addEl.style.display = "none"

                // Handle the highlighting of the row
                document.querySelectorAll("tr.table-active").forEach(r => r.classList.remove("table-active", "fw-bold"))
                tr?.classList.add("table-active", "fw-bold")
                tableEl.classList.remove("table-hover")

                // Render and display the card for this row
                const card = new Card({ controller, entity, id: row.id, view, layout })
                await card.initialize()
                cardEl.style.display = "block"
                cardEl.dataset.openId = String(row.id)
                cardEl.innerHTML = await card.render()
                card.trigger()
            })
        })

        // Trigger checking rows for group action
        $("#flGroup").hide()
        this.listRows.forEach(listRow => {
            const i = listRow.i
            const row = document.getElementById(`flListCheck-${ i }`)
            const id = listRow.row.id
            row.onclick = (e) => {
                if (e.shiftKey) {
                    const max = i, state = row.checked
                    let min = 0
                    this.listRows.forEach(lr => {
                        const i = lr.i, r = document.getElementById(`flListCheck-${ i }`)
                        if (r.checked && i < max) min = i
                    })
                    this.listRows.forEach(lr => {
                        const i = lr.i, r = document.getElementById(`flListCheck-${ i }`)
                        if (i >= min && i <= max) r.checked = state
                        this.toggleChecked(lr.row.id, r.checked)
                    })
                } else {
                    this.toggleChecked(id, row.checked)
                }

                const checked = this.checkedIds.size
                let sumChecked = 0
                this.listRows.forEach(lr => {
                    const i = lr.i, r = document.getElementById(`flListCheck-${ i }`)

                    let sum = this.sumable ? Number.parseFloat(lr.row[this.sumable]) : 0
                    if (r.checked) sumChecked += sum
                })

                if (checked > 0) {
                    $("#flGroup").show()
                    $("#flDashboard").hide()
                    $("#flAdd").hide()
                    $(".fl-list-count").text(checked)
                    $("#flGroupCount").text(checked)
                    if (sumChecked) $(".fl-list-sum").text(`(${ (Math.round(sumChecked * 100) / 100).toFixed(2).toLocaleString("fr-FR", { minimumFractionDigits: 2 }) })`)
                }
                else {
                    $("#flDashboard").show()
                    if (!cardEl || cardEl.style.display === "none") $("#flAdd").show()
                    $("#flGroup").hide()
                    $(".fl-list-count").text("")
                    $(".fl-list-sum").text("")
                }
    
            }
        })

        // Trigger checking all rows
        const checkAll = (state) =>
        {
            this.listRows.forEach(lr => {
                const i = lr.i, r = document.getElementById(`flListCheck-${ i }`)
                r.checked = state
                this.toggleChecked(lr.row.id, state)
            })

            if (state)
            {
                $("#flGroup").show()
                $("#flDashboard").hide()
                $("#flAdd").hide()
                const count = this.checkedIds.size
                let sum = 0
                this.listRows.forEach(lr => {
                    sum += this.sumable ? Number.parseFloat(lr.row[this.sumable]) : 0
                })
                $(".fl-list-count").text(count)
                if (sum) $(".fl-list-sum").text(`(${ (Math.round(sum * 100) / 100).toFixed(2).toLocaleString("fr-FR", { minimumFractionDigits: 2 }) })`)
            }
            else {
                $("#flDashboard").show()
                if (!cardEl || cardEl.style.display === "none") $("#flAdd").show()
                $("#flGroup").hide()
                $(".fl-list-count").text("")
                $(".fl-list-sum").text("")
            }
        }

        const checkAllUp = document.getElementById("flListCheckAllUp")
        const checkAllDown = document.getElementById("flListCheckAllDown")
        document.getElementById("flListCheckAllUp").onclick = () => {
            checkAllDown.checked = checkAllUp.checked
            checkAll(checkAllUp.checked)
        }

        document.getElementById("flListCheckAllDown").onclick = () => {
            checkAllUp.checked = checkAllDown.checked
            checkAll(checkAllDown.checked)
        }
    }

    toggleChecked = (id, checked) =>
    {
        if (!this.checkedIds) this.checkedIds = new Set()

        if (checked) this.checkedIds.add(id)
        else this.checkedIds.delete(id)
    }
}
