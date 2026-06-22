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
    }

    render = () =>
    {
        const html = []

        html.push(`
            <div class="section">
                <div class="row">
                    <div class="col-md-6">
                        <div class="text-center">Appels</div>
                        <canvas id="flDashboard-appel"></canvas>
                    </div>
                    <div class="col-md-6" >
                        <div class="text-center">Propositions</div>
                        <canvas id="flDashboard-proposition"></canvas>
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
        this.initializeChart({
            id: "flDashboard-appel",
            data: [15, 5],
            background: "rgba(20, 164, 77, 0.5)",
        })

        this.initializeChart({
            id: "flDashboard-proposition",
            data: [9, 11],
            background: "rgba(228, 65, 27, 0.5)",
        })
    }
}
