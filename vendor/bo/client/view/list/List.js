import { ListHeader } from "./ListHeader.js"
import { ListRow } from "./ListRow.js"

import { getSearchParams } from "/flBo/cli/controller/getSearchParams.js"
import { triggerDetail } from "/flBo/cli/controller/triggerDetail.js"
import { triggerList } from "/flBo/cli/controller/triggerList.js"
import { triggerGroup } from "/flBo/cli/controller/triggerGroup.js"

class List
{
    constructor({ context, entity, view, data }) {
        this.context = context
        this.entity = entity
        this.view = view
        this.data = data
        const { rows, order, limit, config, properties } = data
        this.listHeader = new ListHeader({ context, rows, order, limit, config, properties })

        const columns = {}, dictionary = {}
        for (const row of rows) dictionary[row.id] = row
        for (const [propertyId, column] of Object.entries( properties )) {
            const property = column
            if (column.cross) {
                for (const crossRow of (data.crossRows) ? data.crossRows : []) {
                    let row = dictionary[crossRow[property.foreignKey]]
                    if (!row) {
                        row = {}
                        for (const key of Object.keys(config.properties)) {
                            if (crossRow[key]) row[key] = crossRow[key]
                        }
                        rows.push(row)
                        dictionary[crossRow[property.foreignKey]] = row
                    }
                    if (!row[propertyId]) row[propertyId] = []
                    let value = crossRow[property.property]
                    let keep = true
                    if (column.restriction) {
                        for (const [k, v] of Object.entries(column.restriction)) {
                            if (v.substring(0, 1) == "!") {
                                if (crossRow[k] == v.substring(1)) {
                                    keep = false
                                    break
                                }
                            }
                            else if (crossRow[k] != v) {
                                keep = false
                                break
                            }
                        }
                    }
                    if (keep) {
                        const modalities = data.crossProperties[property.property].modalities
                        if (modalities && modalities[value]) value = context.localize(modalities[value])
                        row[propertyId].push(value)
                    }
                }
            }

            columns[propertyId] = property
        }

        this.columns = columns
        let i = 0
        this.listRows = rows.map(row => new ListRow({ context, config, columns, row, i: i++ }))
    }

    render = () => {
        
        const html = [], context = this.context

        html.push(`
        <div class="table-responsive">
            <div class="col-md-12">
                <table class="table table-sm table-hover">
                    <thead class="table-light fl-list">
                        ${ this.listHeader.render() }
                    </thead>
                    <tbody class="table-group-divider">`)

        html.push(`
                        <tr>
                            <td>
                                <div class="text-center">
                                    <input type="checkbox" class="fl-list-check-all" data-toggle="tooltip" data-placement="top" title="${this.context.translate("Check all")}"></input>
                                </div>
                            </td>

                            <td class="text-center">
                                <button type="button" class="btn btn-sm btn-outline-primary index-btn fl-list-detail fl-list-add" title="${this.context.translate("Add")}" data-mdb-ripple-init data-mdb-modal-init data-mdb-target="#flListDetailModalForm" data-id="0">
                                    <span class="fas fa-plus"></span>
                                </button>
                                <button 
                                type="button"
                                class="btn btn-sm btn-outline-primary index-btn fl-list-group"
                                data-fl-controller="flBo"
                                data-fl-action="group"
                                data-mdb-ripple-init
                                data-mdb-modal-init
                                data-mdb-target="#flListDetailModalForm"
                                data-toggle="tooltip"
                                data-placement="top"
                                title="${this.context.translate("Grouped actions")}"
                                >
                                    <span class="fas fa-list"></span>
                                </button>
                            </td>

                            <td colspan="${Object.keys(this.columns).length}" />
                        </tr>`)

        this.listRows.map(listRow => html.push(listRow.render()))

        html.push(`
                        <tr class="listRow">
                            <td>
                                <div class="text-center">
                                    <input type="checkbox" class="fl-list-check-all" title="${context.translate("Check all")}"></input>
                                </div>
                            </td>

                            <td class="text-center">
                                <button type="button" class="btn btn-sm btn-outline-primary index-btn fl-list-detail fl-list-add" title="${context.translate("Add")}" data-mdb-ripple-init data-mdb-modal-init data-mdb-target="#flListDetailModalForm" data-id="0">
                                    <span class="fas fa-plus"></span>
                                </button>
                                <button 
                                type="button"
                                class="btn btn-sm btn-outline-primary index-btn fl-list-group"
                                data-fl-controller="flBo"
                                data-fl-action="group"
                                data-mdb-ripple-init
                                data-mdb-modal-init
                                data-mdb-target="#flListDetailModalForm"
                                data-toggle="tooltip"
                                data-placement="top"
                                title="${this.context.translate("Grouped actions")}"
                                >
                                    <span class="fas fa-list"></span>
                                </button>
                                ${(this.listRows.length == this.data.limit) 
        ? `
                                    <button type="button" class="btn btn-sm btn-outline-primary fl-list-more" data-toggle="tooltip" data-placement="top" title="${context.translate("Display the entire list")}">
                                        <i class="fas fa-ellipsis-h"></i>
                                    </button>`
        : ""}
                            </td>

                            <td colspan="${Object.keys(this.columns).length}" />
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
        const context = this.context
        const entity = this.entity
        const view = this.view

        let params = []
        for (let [key, value] of Object.entries(getSearchParams())) {
            if (Array.isArray(value)) {
                if (value[0] == null) value = `<=,${value[1]}`
                else if (value[1] == null) value = `>=,${value[0]}`
                else value = `between,${value[0]},${value[1]}`
            }
            params.push(key + ":" + value)
        }

        $(".fl-list-order-button").click(function() {
            const propertyId = $(this).attr("data-fl-property")
            let direction = $(this).attr("data-fl-direction")
            if (!direction || direction == "-") direction = ""
            else direction = "-"
            triggerList({ context, entity, view }, `${direction}${propertyId}`)
        })

        // Extend the displayed list

        $(".fl-list-more").click(function () {
            $("#flListLimitHidden").val(this.data.limit * 2)
            triggerList({ context, entity, view })
        })

        // Enable group action

        $(".fl-list-group").hide()

        // Trigger checking rows for group action

        $(".fl-list-check").click(function (e) {
            if (e.shiftKey) {
                const max = $(this).attr("data-row-id"), state = $(this).prop("checked")
                let min = 0
                $(".fl-list-check").each(function () {
                    const i = parseInt($(this).attr("data-row-id"))
                    if ($(this).prop("checked") && i < max) min = i
                })
                $(".fl-list-check").each(function () {
                    const i = parseInt($(this).attr("data-row-id"))
                    if (i >= min && i <= max) $(this).prop("checked", state)
                })
            } 

            let checked = 0, sumChecked = 0

            $(".fl-list-check").each(function () {
                if ($(this).prop("checked")) checked++

                let amount = $(this).attr("data-val")
                if (amount) {
                    amount = parseFloat(amount)
                    if ($(this).prop("checked")) sumChecked += amount
                }
            })

            if (checked > 0) {
                $(".fl-list-group").show()
                $(".fl-list-add").hide()
                $(".fl-list-count").text(checked)
                if (sumChecked) $(".fl-list-sum").text((Math.round(sumChecked * 100) / 100).toFixed(2))
            }
            else {
                $(".fl-list-group").hide()
                $(".fl-list-add").show()
                $(".fl-list-count").text("")
                $(".fl-list-sum").text("")
            }
        })

        // Trigger checking all

        $(".fl-list-check-all").click(function () {
            const state = $(this).prop("checked")
            $(".fl-list-check").prop("checked", state)
            $(".fl-list-check-all").prop("checked", state)

            if (state) {
                $(".fl-list-group").show()
                $(".fl-list-add").hide()

                let count = 0, sum = 0
                $(".fl-list-check").each(function () {
                    count++
                    let amount = $(this).attr("data-val")
                    if (amount) {
                        amount = parseFloat(amount)
                        if ($(this).prop("checked")) sum += amount
                    }
                })
                $(".fl-list-count").text(count)
                if (sum) $(".fl-list-sum").text((Math.round(sum * 100) / 100).toFixed(2))
            }
            else {
                $(".fl-list-group").hide()
                $(".fl-list-add").show()
                $(".fl-list-count").text("")
                if (sum) $(".fl-list-sum").text("")
            }
        })

        triggerDetail({ context, entity, view }, params)
        triggerGroup({ context, entity, view }, params)
    }
}

export { List }
