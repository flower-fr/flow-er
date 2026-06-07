import View from "../View.js"

import Form from "../form/Form.js"
import Group from "../group/Group.js"
import ListHeader from "./ListHeader.js"
import ListRow from "./ListRow.js"
import Detail from "../detail/Detail.js"

export default class List extends View
{
    constructor({ controller, entity, view, where, orderProperty, orderDirection, layout })
    {
        super({ controller })
        this.entity = entity
        this.view = view || "default"
        this.where = where
        this.orderProperty = orderProperty
        this.orderDirection = orderDirection
        this.layout = layout
    }

    initialize = async () =>
    {
        // Retrieve the config and params
        let response = await fetch(`/bo/list/${ this.entity }?view=${ this.view }`)
        const { properties, identifier, params, translations } = await response.json()
        this.properties = properties
        this.identifier = identifier
        this.translations = translations

        // Retrieve the data
        const columns = Object.keys(properties).join(",")
        const where = this.where || Object.entries(params.where).map(([k, v]) => `${ k }:${ v }`).join("|")
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
        response = await fetch(`/core/v1/${ this.entity }?columns=${ columns }&where=${ where }&order=${ order }${ limit ? `&limit=${ limit }` : "" }`)
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
        this.listRows = rows.map(row => { 
            return new ListRow({ i: i++, controller: this.controller, row, filledColumns: this.filledColumns, properties, translations })
        })
    }

    render = () =>
    {    
        const html = [], translations = this.translations

        html.push(`
        <div class="table-responsive">
            <div class="col-md-12">
                <table class="table table-sm table-hover">
                    <thead class="fl-list">
                        ${ this.listHeader.render() }
                    </thead>
                    <tbody class="table-group-divider">`)

        html.push(`
                        <tr>
                            <td>
                                <div class="text-center">
                                    <input type="checkbox" id="flListCheckAllUp" data-toggle="tooltip" data-placement="top" title="${ translations["Check all"] }"></input>
                                </div>
                            </td>

                            <td class="text-center">
                                <a 
                                    href="#!"
                                    class="text-primary"
                                    id="flListAdd"
                                    title="${ translations["Add"] }"
                                >
                                    <span class="fas fa-plus"></span>
                                </a>
                                <a 
                                    href="#!"
                                    class="text-primary"
                                    id="flListGroup"
                                    title="${ translations["Grouped actions"] }"
                                >
                                    <span class="fas fa-list"></span>
                                </a>
                            </td>

                            <td colspan="${Object.keys(this.properties).length}" />
                        </tr>`)

        this.listRows.map(listRow => html.push(listRow.render())).join("\n")

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
        const controller = this.controller, entity = this.entity, view = this.view, translations = this.translations

        this.listHeader.trigger()

        // Extend the displayed list

        $(".fl-list-more").click(function () {
            $("#flListLimitHidden").val(this.data.limit * 2)
            // triggerList({ context, entity, view })
        })

        // Enable add action
        $("#flListAdd").click(() => {
            controller.stack(new Form({ controller, entity, view }), translations["New"], true)
        })

        // Enable group action
        $("#flListGroup").click(() => {
            controller.stack(new Group({ controller, entity, view }), translations["Grouped actions"], true)
        })

        // Enable detail action
        this.rows.forEach(row => {
            $(`#flListDetail-${ row.id }`).click(() => {
                controller.stack(new Detail({ controller, entity, id: row.id, view: "default" }), row[this.identifier])
            })
        })

        $("#flListGroup").hide()

        // Trigger checking rows for group action
        this.listRows.forEach(listRow => {
            const i = listRow.i
            const row = document.getElementById(`flListCheck-${ i }`)
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
                    })
                }

                let checked = 0, sumChecked = 0
                this.listRows.forEach(lr => {
                    const i = lr.i, r = document.getElementById(`flListCheck-${ i }`)
                    if (r.checked) checked++

                    let sum = lr.sumable || 0
                    if (r.checked) sumChecked += sum
                })

                if (checked > 0) {
                    $("#flListGroup").show()
                    $("#flListAdd").hide()
                    $(".fl-list-count").text(checked)
                    if (sumChecked) $(".fl-list-sum").text((Math.round(sumChecked * 100) / 100).toFixed(2))
                }
                else {
                    $("#flListGroup").hide()
                    $("#flListAdd").show()
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
            })

            if (state)
            {
                $("#flListGroup").show()
                $("#flListAdd").hide()
                let count = 0, sum = 0
                this.listRows.forEach(lr => {
                    count++
                    sum += lr.sumable || 0
                })
                $(".fl-list-count").text(count)
                if (sum) $(".fl-list-sum").text((Math.round(sum * 100) / 100).toFixed(2))
            }
            else {
                $("#flListGroup").hide()
                $("#flListAdd").show()
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
}
