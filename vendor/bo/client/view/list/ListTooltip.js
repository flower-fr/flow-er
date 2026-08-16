import View from "../View.js"

export default class ListEvents extends View
{
    constructor({ controller, list, eventConfig }) {
        super({ controller })
        this.list = list
        this.eventConfig = eventConfig
    }

    initialize = async () => {
        const { eventConfig } = this
        const response = await fetch(`/core/v1/${ eventConfig.entity }?columns=${ eventConfig.columns.join(",") }&order=-touched_at&limit=10000`)
        const rows = (await response.json()).rows
        this.events = {}
        for (const row of rows) {
            if (!this.events[row[eventConfig.foreignKey]]) this.events[row[eventConfig.foreignKey]] = []
            this.events[row[eventConfig.foreignKey]].push(row)
        }
        this.trigger(this.events)
    }

    render = (events) => 
    {
        const html = []

        for (const event of events) {
            html.push(`
                <div><strong>${ moment(event.touched_at).format("DD/MM") } (${ event.user_n_fn })</strong></div>
                <div>${ (event.summary.length > 100) ? `${ event.summary.substr(0,100) }&hellip;` : event.summary }</div>`)
        }

        return html.join("\n")
    }

    trigger = (events) => {
        for (const [key, rows] of Object.entries(events)) {
            const el = document.getElementById(`flListTooltip-${ key }`)
            if (el) {
                el.setAttribute("title", this.render(rows))
                new mdb.Tooltip(el, { html: true, placement: "right" })
            }
        }
    }
}
