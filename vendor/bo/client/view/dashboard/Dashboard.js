import View from "../View.js"
import dateValue from "../../utils/dateValue.js"
import dateLabel from "../../utils/dateLabel.js"

const DEFAULT_BACKGROUND = [
    "rgba(40, 90, 190, 0.6)",
    "rgba(200, 50, 50, 0.6)",
    "rgba(15, 150, 70, 0.6)",
    "rgba(220, 130, 25, 0.6)", 
]

export default class Dashboard extends View
{
    constructor({ controller, entity, view })
    {
        super({ controller })
        this.entity = entity
        this.view = view
    }

    initialize = async () =>
    {
        // Fetch the config of the dashboard from the server
        let response = await fetch(`/bo/dashboard/${ this.entity }?view=${ this.view }`)
        if (!response.ok) return this.chartData = []
        const res = await response.json()
        const configs = res.dashboards
        if (!configs || configs.length === 0) return this.chartData = []

        const datas = []
        for (const config of configs) {
            // Fetch data for each indicator in the config
            const fetchPromises = (config.indicators ?? []).map(indicator => {
                const where = (indicator.where) ? Object.entries(indicator.where).map(([key, value]) => `${key}:${dateValue(value)}`).join("|") : undefined
                return fetch(`/core/v1/${indicator.entity}?columns=${indicator.aggregator}:${indicator.column}${ where ? `&where=${where}` : "" }`).then(res => res.ok ? res.json() : {})
            })
            // Wait for all fetches to complete
            const indicatorData = await Promise.all(fetchPromises).then(results => results.map(result => result?.rows?.[0]?.id ?? 0))
            datas.push(indicatorData)
        }

        this.chartData = configs.map((config, index) => {
            const labels = (config.indicators ?? []).map(indicator => dateLabel(indicator.label))
            return {
                id: `flDashboard-${index}`,
                label: config.title,
                labels,
                data: datas[index],
                background: config.background ?? DEFAULT_BACKGROUND,
            }
        })
    }

    render = () =>
    {
        const html = []

        html.push(`
            <div class="section" id="flDashboard">
                <div class="row justify-content-center">`)

        this.chartData.forEach(chart => {
            if (!chart.data || chart.data.length === 0) return
            html.push(`
                    <div class="col-12 col-sm-${12 / (this.chartData.length - 2)} d-flex flex-column align-items-center">
                        <div class="text-center mb-2">${chart.label ?? ""}</div>
                        <div class="ratio ratio-16x9" style="max-height: 120px; max-width: 350px;">
                            <canvas id="${chart.id}"></canvas>
                        </div>
                    </div>`)})

        html.push(`</div>
            </div>`)

        return html.join("\n")
    }

    initializeChart = ({ id, label, labels, data, background }) =>
    {
        const canvas = document.getElementById(id)

        const chartData = {
            type: "doughnut",
            data: {
                labels,
                datasets: [{
                    label,
                    data,
                    backgroundColor: background,
                }],
            },
        }
    
        const chartOptions = {
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: "right"
                    }
                }
            }
        }

        new mdb.Chart(canvas, chartData, chartOptions)
    }

    trigger = () =>
    {
        this.chartData.forEach(chart => this.initializeChart(chart))
    }
}
