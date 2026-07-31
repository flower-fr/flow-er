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
        const { properties, identifier, params, summable, translations } = await response.json()
        this.properties = properties
        this.identifier = identifier
        this.translations = translations
        this.summable = summable

        // Retrieve the data
        const columns = Object.keys(properties).join(",")
        let where = this.where
        const tags = this.tags
        if (!where && !tags) where = ((params.where) ? Object.entries(params.where).map(([k, v]) => `${ k }:${ v }`).join("|") : [])

        // Define order and grouping property
        let orderProperty, orderDirection
        const order = this.orderProperty ? `${ (this.orderDirection === "desc") ? "-" : "" }${ this.orderProperty }` : Object.entries(params.order).map(([k, v]) => `${ v === "desc" ? "-" : "" }${ k }`).join("|")
        if (!this.orderProperty) this.orderProperty = Object.keys(params.order)[0]
        if (!this.orderDirection) this.orderDirection = params.order[orderProperty]
        orderProperty = this.orderProperty
        orderDirection = this.orderDirection
        this.group = properties[orderProperty].group

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
        this.listHeader = new ListHeader({ controller: this.controller, list: this, rows, filledColumns: this.filledColumns, properties, orderProperty, orderDirection, limit, translations, layout: this.layout })

        // this.listRows = rows.map(row => { 
        //     return new ListRow({ i: i++, controller: this.controller, row, filledColumns: this.filledColumns, properties, translations })
        // })
        this.checkedIds = new Set()
    }

    groupRows = () =>
    {
        let i = 0
        const { rows, properties, orderProperty, translations, group } = this
        this.groups = [], this.listRows = []
        let currentPrefix, currentGroup, identifier = 0
        for (const row of rows) {
            const pred = () => {
                let prefix , current
                switch (group) {
                case "month":
                    prefix = row[orderProperty].substr(0, 7)
                    current = currentPrefix?.substr(0, 7)
                    break
                case "week":
                    prefix = moment(row[orderProperty]).week()
                    current = moment(currentPrefix).week()
                    break
                case "day":
                    prefix = row[orderProperty].substr(0, 10)
                    current = currentPrefix?.substr(0, 10)
                    break
                default:
                    prefix = row[orderProperty]
                    current = currentPrefix
                    break
                }
                return prefix !== current
            }
            if (pred()) {
                currentPrefix = row[orderProperty]
                currentGroup = [new ListGroup({ controller: this.controller, identifier: identifier++, list: this, value: row[orderProperty], size: Object.entries(row).length, translations })]
                this.groups.push(currentGroup)
            }
            const listRow = new ListRow({ i: i++, controller: this.controller, list: this, row, filledColumns: this.filledColumns, properties, orderProperty, translations })
            currentGroup.push(listRow)
            this.listRows.push(listRow)
        }
    }

    render = () =>
    {    
        const html = [], { group, translations } = this

        this.groupRows()

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

        if (group) {
            this.groups.forEach(group => {
                const h = []
                group.map(listRow => h.push(listRow.render()))
                h.push("</tbody>")
                html.push(h.join("\n"))
            })
        } else {
            this.listRows.map(listRow => html.push(listRow.render())).join("\n")
        }

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
        const { controller, group, entity, view, layout } = this
        const tableEl = document.getElementById("flListTable")
        const cardEl = document.getElementById("flCard")
        const dashboardEl = document.getElementById("flDashboard")
        const groupEl = document.getElementById("flGroup")
        const addEl = document.getElementById("flAdd")

        this.listHeader.trigger()

        if (group) this.groups.forEach(x => x[0].trigger())
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

                    let sum = this.summable ? Number.parseFloat(lr.row[this.summable.propertyId]) : 0
                    if (r.checked) sumChecked += sum
                })

                if (checked > 0) {
                    $("#flGroup").show()
                    $("#flDashboard").hide()
                    $("#flAdd").hide()
                    const sumLabel = (sumChecked) ? `${ new Intl.NumberFormat("fr-FR", this.summable.format ? this.summable.format : {}).format(sumChecked) }${ this.summable.unit ? ` ${ this.summable.unit }` : "" }` : ""
                    $(".fl-group-count").text(checked ? checked : "")
                    $(".fl-group-btn-count").text(checked ? `(${ checked })` : "")
                    if (sumChecked) $(".fl-group-sum").text(`(${ sumLabel })`)
                }
                else {
                    $("#flDashboard").show()
                    if (!cardEl || cardEl.style.display === "none") $("#flAdd").show()
                    $("#flGroup").hide()
                    $(".fl-group-count").text("")
                    $(".fl-group-btn-count").text("")
                    $(".fl-group-sum").text("")
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
                    sum += this.summable ? Number.parseFloat(lr.row[this.summable.propertyId]) : 0
                })
                const sumLabel = (sum) ? `${ new Intl.NumberFormat("fr-FR", this.summable.format ? this.summable.format : {}).format(sum) }${ this.summable.unit ? ` ${ this.summable.unit }` : "" }` : ""
                $(".fl-group-count").text(count)
                $(".fl-group-btn-count").text(`(${ count })`)
                if (sum) $(".fl-group-sum").text(`(${ sumLabel })`)
            }
            else {
                $("#flDashboard").show()
                if (!cardEl || cardEl.style.display === "none") $("#flAdd").show()
                $("#flGroup").hide()
                $(".fl-group-count").text("")
                $(".fl-group-btn-count").text("")
                $(".fl-group-sum").text("")
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
