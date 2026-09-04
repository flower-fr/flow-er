import ExcelJS from "/js/exceljs.esm.js"
import Form from "../form/Form.js"
import importXlsx from "../../utils/importXlsx.js"
import Toast from "../toast/Toast.js"
import View from "../View.js"

export default class Global extends View
{
    constructor({ controller, entity, view, locale, layout })
    {
        super({ controller })
        this.entity = entity
        this.view = view || "default"
        this.locale = locale
        this.layout = layout
        this.importFiles = {}
    }

    initialize = async () =>
    {
        const response = await fetch(`/bo/global/${ this.entity }?view=${ this.view }`)
        const { actions, translations } = await response.json()
        this.actions = actions
        this.translations = translations
    }

    render = () =>
    {
        const html = []

        if (this.actions) {
            html.push(
                `<div class="card" id="flGlobal">
                <div class="card-body">`)

            const actionHtml = []
            for (const [actionId, action] of Object.entries(this.actions)) {

                if (action.type === "import") {
                    actionHtml.push(`
                        <input type="file" class="form-control form-control-sm mb-2" id="flGlobalImportFile-${ actionId }" />
                        <button type="button" class="btn ${ (action.class === "danger") ? "btn-danger" : "btn-warning" }" id="flGlobal-${ actionId }">
                            <i ${ (action.glyph) ? `class="fa ${action.glyph}"` : "" }></i> ${ action.label }
                        </button>`)

                } else if (!action.type || action.type == "modal") {
                    actionHtml.push(`
                        <button
                            type="button"
                            class="btn btn-outline-primary"
                            id="flGlobal-${ actionId }"
                        >
                            <i ${ (action.glyph) ? `class="fa ${action.glyph}"` : "" }></i> ${ action.label }
                        </button>`)

                } else {
                    actionHtml.push(`
                        <a
                            type="button"
                            class="btn btn-outline-primary"
                            href="/${action.controller}/${action.action}/${action.entity}${ (action.id) ? `/${action.id}` : "" }?${ (action.view) ? `view=${action.view}` : "" }"
                        >
                            <i ${ (action.glyph) ? `class="fa ${action.glyph}"` : "" }></i> ${ action.label }
                        </a>`)
                }
            }
            html.push(actionHtml.join("<hr />"))

            html.push(`
                    </div>
                </div>`)   
        }

        return html.join("\n")
    }

    trigger = () =>
    {
        const { controller, entity, view } = this
        for (const [actionId, action] of Object.entries(this.actions)) {
            // Handle file input change
            if (action.type && action.type === "import") {
                document.getElementById(`flGlobalImportFile-${ actionId }`)?.addEventListener("change", event => {
                    this.importFiles[actionId] = event.target.files[0] ?? null
                })
            }

            // Handle button click
            $(`#flGlobal-${ actionId }`).click(() => {
                if (action.type && action.type === "import") return this.runImport(action, actionId)
                if (action.type && action.type !== "modal") return
                controller.screenIndex = 1
                controller.stackView = []
                controller.stack(new Form({ controller: action.controller, entity: action.entity, view: action.view }), action.label, true)
            })
        }


    }

    runImport = async (action, actionId) => {
        if (!this.importFiles?.[actionId]) return
        const buffer = await this.importFiles[actionId].arrayBuffer()

        // Load the XLSX file using ExcelJS
        const workbook = new ExcelJS.Workbook()
        await workbook.xlsx.load(buffer)

        // Get the first worksheet and its header
        const worksheet = workbook.getWorksheet(1)
        const headers = worksheet.getRow(1).values

        // Extract rows from the worksheet
        const rows = []
        worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
            if (rowNumber === 1) return
            const rowData = {}
            row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
                rowData[headers[colNumber]] = cell.value
            })
            rows.push(rowData)
        })
        
        let response = await fetch(`/bo/import/${ action.entity }?view=${ action.view }`)
        const config = await response.json()
        
        // Extract identifiers
        const identifiers = rows.map(row => row[config.properties?.identifier?.header])
    
        // Fetch database rows from the database based on identifiers and where
        const identifierString = identifiers.join(",")
        const whereParam = Object.entries({ ...config.params.where, ...action.restriction }).map(([k, v]) => `${k}:${v}`).join("|")
        const columnsParam = [...new Set(Object.values(config.properties).filter(v => !!v.property).map(v => v.property))].join(",")
        response = await fetch(`/core/v1/${ action.entity }?columns=${ columnsParam }&where=identifier:${ encodeURIComponent(identifierString) }|${ whereParam }`)
        const data = await response.json()

        const logInteraction = (status, responseBody) => fetch("/core/v1/interaction", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify([{
                status,
                provider: "flow-er",
                endpoint: "bo/import-xlsx",
                method: "POST",
                body: JSON.stringify(rows),
                response_body: JSON.stringify(responseBody),
            }])
        })

        // Run the importXlsx function to determine which rows to update and which to reject
        const { toUpdate, rejected } = importXlsx(rows, config, data.rows)

        // Show rejected rows in a toast
        if (Object.keys(rejected).length > 0) {
            console.log("Rejected rows:", rejected)
            const toast = new Toast({ controller: this.controller },
                { title: "Importation", message: `${Object.keys(rejected).length} lignes ont été rejetées.`, type: "warning", persistent: true })
            toast.initialize()
            toast.trigger()
        }

        // If there are no rows to update, show a toast and return
        if (toUpdate.length === 0) {
            await logInteraction("processed", { toUpdate, rejected })
            const toast = new Toast({ controller: this.controller }, { title: "Importation", message: "Aucune donnée à mettre à jour." })
            toast.initialize()
            toast.trigger()
            return
        }

        const body = toUpdate.map(row => ({ ...row, status: config.params.nextStatus }))
        response = await fetch(`/core/v1/${ action.entity }`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        })
        const result = await response.json()

        const updateFailed = !response.ok || result.error
        await logInteraction(updateFailed ? "error" : "processed", { toUpdate, rejected, result })

        // Handle error response
        if (updateFailed) {
            const toast = new Toast({ controller: this.controller },
                { title: "Importation", message: "Une erreur est survenue lors de la mise à jour.", type: "error", persistent: true })
            toast.initialize()
            toast.trigger()
            return
        }

        // Show success toast
        const toast = new Toast({ controller: this.controller },
            { title: "Importation", message: `${toUpdate.length} lignes ont été mises à jour.`, type: "success" })
        toast.initialize()
        toast.trigger()

        this.layout.refreshList({})
    }
}
