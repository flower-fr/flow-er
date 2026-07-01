import View from "../View.js"
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
        // Fetch the structure of the dashboard from the server
        let response = await fetch(`/bo/dashboard/${ this.entity }?view=${ this.view }`)
        if (!response.ok) return this.chartData = []
        const structure = await response.json()
        
        // Fetch data for each property in the structure
        const fetchPromises = Object.entries(structure).filter(([key, value]) => key !== "tags").map(([key, value]) => {
            const where = value.where
                ? "&where=" + Object.entries(value.where).map(([k, v]) => `${k}:${v}`).join("|")
                : ""

            return fetch(`/core/v1/${value.entity}?columns=${value.columns}${where}`).then(res => res.ok ? res.json() : {})
        })

        // Wait for all fetches to complete
        const data = await Promise.all(fetchPromises)

        // Prepare chart data based on the fetched data and the structure
        const chartData = Object.entries(structure).filter(([key, value]) => key !== "tags").map(([key, value], index) => {
            const count = data[index]?.rows?.length ?? 0
            return {
                id: `flDashboard-${ key }`,
                label: value.title,
                // labels: [value.title, "Restant"],
                data: [count, Math.max(0, value.objective - count)],
                background: value.background,
            }
        })
        this.chartData = chartData
    }

    render = () =>
    {
        const html = []

        html.push(`
            <div class="section" id="flDashboard">
                <div class="row">
                    <div class="col-6">
                        <div class="text-center">${this.chartData[0]?.label}</div>
                        <canvas id="${this.chartData[0]?.id}"></canvas>
                    </div>
                    <div class="col-6" >
                        <div class="text-center">${this.chartData[1]?.label}</div>
                        <canvas id="${this.chartData[1]?.id}"></canvas>
                    </div>
                </div>
            <hr>
            </div>`)

        return html.join("\n")
    }

    initializeChart = ({ id, label, labels, data, background }) =>
    {
        const chart = document.getElementById(id)
        const dataDoughnut = {
            type: "doughnut",
            data: {
                datasets: [{
                    backgroundColor: [
                        background,
                        "rgba(255, 255, 255, 0.5)",
                    ],
                }],
            },
        }
        dataDoughnut.data.labels = labels
        dataDoughnut.data.datasets[0].label = label
        dataDoughnut.data.datasets[0].data = data
        new mdb.Chart(chart, dataDoughnut)
    }

    trigger = () =>
    {
        this.chartData.forEach(chart => this.initializeChart(chart))
    }
}
