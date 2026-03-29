import View from "../View.js"

import Form from "../form/Form.js"
import ListHeader from "./ListHeader.js"
import ListRow from "./ListRow.js"
import Tabbar from "../tabbar/Tabbar.js"

export default class List extends View
{
    constructor({ controller, entity, view })
    {
        super({ controller })
        this.entity = entity
        this.view = view || "default"
    }

    initialize = async () =>
    {
        // Retrieve the config and params
        let response = await fetch(`/bo/list/${ this.entity }?view=${ this.view }`)
        const { properties, params, translations } = await response.json()
        this.properties = properties
        // this.order = order
        // this.limit = limit
        this.translations = translations

        // Retrieve the data
        const columns = Object.keys(properties).join(",")
        const where = Object.entries(params.where).map(([k, v]) => `${ k }:${ v }`).join("|")
        const order = Object.entries(params.order).map(([k, v]) => `${ v === "desc" ? "-" : "" }${ k }`).join("|")
        const limit = params.limit
        response = await fetch(`/core/v1/${ this.entity }?columns=${ columns }&where=${ where }&order=${ order }${ limit ? `&limit=${ limit }` : "" }`)
        const rows = (await response.json()).rows

        this.listHeader = new ListHeader({ controller: this.controller, rows, properties, order, limit, translations })
        this.listRows = rows.map(row => new ListRow({ controller: this.controller, row, properties, translations }))
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
                                    <input type="checkbox" class="fl-list-check-all" data-toggle="tooltip" data-placement="top" title="${ translations["Check all"] }"></input>
                                </div>
                            </td>

                            <td class="text-center">
                                <button type="button" class="btn btn-sm btn-outline-primary index-btn fl-list-add" title="${ translations["Add"] }" data-mdb-ripple-init data-id="0">
                                    <span class="fas fa-plus"></span>
                                </button>
                                <button 
                                type="button"
                                class="btn btn-sm btn-outline-primary index-btn fl-list-group"
                                data-fl-controller="flBo"
                                data-fl-action="group"
                                data-mdb-ripple-init
                                data-toggle="tooltip"
                                data-placement="top"
                                title="${ translations["Grouped actions"] }"
                                >
                                    <span class="fas fa-list"></span>
                                </button>
                            </td>

                            <td colspan="${Object.keys(this.properties).length}" />
                        </tr>`)

        this.listRows.map(listRow => html.push(listRow.render())).join("\n")

        html.push(`
                        <tr class="listRow">
                            <td>
                                <div class="text-center">
                                    <input type="checkbox" class="fl-list-check-all" title="${ translations["Check all"] }"></input>
                                </div>
                            </td>

                            <td class="text-center">
                                <button type="button" class="btn btn-sm btn-outline-primary index-btn fl-list-detail fl-list-add" title="${ translations["Add"] }" data-mdb-ripple-init data-id="0">
                                    <span class="fas fa-plus"></span>
                                </button>
                                <button 
                                type="button"
                                class="btn btn-sm btn-outline-primary index-btn fl-list-group"
                                data-fl-controller="flBo"
                                data-fl-action="group"
                                data-mdb-ripple-init
                                data-toggle="tooltip"
                                data-placement="top"
                                title="${ translations["Grouped actions"] }"
                                >
                                    <span class="fas fa-list"></span>
                                </button>
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

        $(".fl-list-order-button").click(function() {
            const propertyId = $(this).attr("data-fl-property")
            let direction = $(this).attr("data-fl-direction")
            if (!direction || direction == "-") direction = ""
            else direction = "-"
            // triggerList({ context, entity, view }, `${direction}${propertyId}`)
        })

        // Extend the displayed list

        $(".fl-list-more").click(function () {
            $("#flListLimitHidden").val(this.data.limit * 2)
            // triggerList({ context, entity, view })
        })

        // Enable add action
        $(".fl-list-add").click(() => {
            controller.stack(new Form({ controller, entity, view }), translations["New"])
        })

        // Enable detail action
        $(".fl-list-detail").click(() => {
            controller.stack(new Tabbar({ controller, entity, level: "detail", view: "default" }), "À remplacer par l’identifiant de la donnée")
        })

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
    }
}
