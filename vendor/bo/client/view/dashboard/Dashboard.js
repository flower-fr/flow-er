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
            <div class="section" id="flDashboard">
                <div class="text-center">Mois en cours</div>
                <canvas class="fl-doughnut-chart" id="chart-0" data-mdb-chart-init></canvas>
                <hr>
            </div>`)

        return html.join("\n")
    }

    renderEntries = ({ menu }) => 
    {
        const html = []
        for (let [menuTabId, menuTab] of Object.entries(menu)) {
            const params = menuTab.params ? `/${ Object.values(menuTab.params).map(value => value).join("/") }` : ""
            const query = menuTab.query ? `?${Object.entries(menuTab.query).map(([key, value]) => `${key}=${value}`).join("&")}` : ""
            const route = `/${ menuTab.controller }/${ menuTab.action }${ params }${ query }`

            html.push(`<li class="nav-item">
                <a class="nav-link ${ menuTabId === this.defaultTab ? "active" : "" } ${ menuTab.disabled ? "btn disabled" : ""}" href="${route}" id="${menuTabId}-anchor">
                    ${ menuTab.label }
                </a>
            </li>`)
        }
        return html.join("\n")
    }

    initializeChart = ({ id, label, labels, data }) =>
    {
        const chart = document.getElementById(id)
        const dataDoughnut = {
            type: "doughnut",
            data: {
                datasets: [{
                    backgroundColor: [
                        "rgba(63, 81, 181, 0.5)",
                        "rgba(77, 182, 172, 0.5)",
                        "rgba(66, 133, 244, 0.5)",
                        "rgba(156, 39, 176, 0.5)",
                        "rgba(233, 30, 99, 0.5)",
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
            id: "chart-0",
            label: "Année en cours",
            labels: ["Nouveau: 5", "Prise de contact: 3", "Rendez-vous: 1"],
            data: [5, 3, 1],
        })
    }
}
