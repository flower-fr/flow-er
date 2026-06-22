import View from "../View.js"

import Form from "../form/Form.js"
import Group from "../group/Group.js"
import ListHeader from "./ListHeader.js"
import ListRow from "./ListRow.js"
import Detail from "../detail/Detail.js"

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

//         // html.push(`
//         //                 <tr>
//         //                     <td/>

//         //                     <td class="text-center">
//         //                         <a 
//         //                             href="#!"
//         //                             class="text-primary"
//         //                             id="flListAdd"
//         //                             title="${ translations["Add"] }"
//         //                         >
//         //                             <span class="fas fa-plus"></span>
//         //                         </a>
//         //                     </td>`)

//         for (const propertyId of this.filledColumns) {
//             if (this.properties[propertyId]) {
//                 html.push("<td>")
//                 if (propertyId == "linkedin") {
//                     const property = this.properties[propertyId]
//                     html.push(`
//                                 <div class="dropdown" id="flListEdit-linkedin">
//                                     <button
//                                         class="btn btn-sm btn-outline-primary dropdown-toggle"
//                                         type="button"
//                                         data-mdb-dropdown-init
//                                         data-mdb-ripple-init
//                                         aria-expanded="false"
//                                         id="flListDropdown-linkedin"
//                                         title="${ translations["Grouped actions"] }"
//                                     >
//                                         <small><i class="fas fa-edit me-md-2"></i></small>
//                                     </button>
//                                     <div class="dropdown-menu" style="width: 320px">
//                                         <form class="px-4 py-3">
//                                             <div class="form-outline mb-4">
//                                                 <select class="form-select form-select-sm fl-modal-form-select" id="flList-template" data-mdb-size="sm">
//                                                     <option />
//                                                     <option value="1">Template 1</option>
//                                                     <option value="2">Template 2</option>
//                                                     <option value="3">Template 3</option>
//                                                 </select>
//                                                 <label class="form-label select-label">Template</label>
//                                             </div>
//                                             <div class="form-outline mb-4" data-mdb-input-init>
//                                                 <textarea id="flList-text" class="form-control" rows="10">Bonjour { prenom }

// Je me permets de vous contacter car j'ai vu que vous étiez en charge de { sujet } chez { entreprise }.

// Chez Double Crème, nous aidons les entreprises du secteur de l'IT à vendre sans effort.

// Seriez-vous disponible pour en discuter ? Je serais ravi de vous présenter comment nous pouvons vous aider à atteindre vos objectifs.

// Cordialement,
// { mon_prenom }</textarea>
//                                                 <label class="form-label" for="flList-text">Message</label>
//                                             </div>
//                                             <div class="form-outline mb-4">
//                                                 <button class="btn btn-warning">Envoyer l’Inmail</button>
//                                             </div>
//                                         </form>
//                                     </div>

//                                 </div>`)
//                 } 
//                 html.push("</td>")
//             }
//         }

//         html.push("</tr>")

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

        this.listRows.forEach(x => x.trigger())

        // Extend the displayed list

        $(".fl-list-more").click(function () {
            $("#flListLimitHidden").val(this.data.limit * 2)
            // triggerList({ context, entity, view })
        })

        // Enable add action
        $("#flListAdd").click(() => {
            controller.stack(new Form({ controller, entity, view }), translations["New"], true)
        })

        // Enable detail action
        this.rows.forEach(row => {
            $(`#flListDetail-${ row.id }`).click(() => {
                controller.stack(new Detail({ controller, entity, id: row.id, view: "default" }), row[this.identifier])
            })
        })

        // Trigger checking rows for group action
        $("#flGroup").hide()
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
                    $("#flAdd").show()
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
            })

            if (state)
            {
                $("#flGroup").show()
                $("#flDashboard").hide()
                $("#flAdd").hide()
                let count = 0, sum = 0
                this.listRows.forEach(lr => {
                    count++
                    sum += this.sumable ? Number.parseFloat(lr.row[this.sumable]) : 0
                })
                $(".fl-list-count").text(count)
                if (sum) $(".fl-list-sum").text(`(${ (Math.round(sum * 100) / 100).toFixed(2).toLocaleString("fr-FR", { minimumFractionDigits: 2 }) })`)
            }
            else {
                $("#flDashboard").show()
                $("#flAdd").show()
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
}
