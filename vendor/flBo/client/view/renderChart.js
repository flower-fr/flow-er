const renderChart = ({ context, entity, view }, label, data, id) => {

    const pairs = {}
    for (const key of Object.keys(data.properties.value.modalities)) {
        pairs[key] = 0
    }
    for (const row of data.rows) {
        pairs[row.value]++
    }
    const labels = {}
    for (const [key, value] of Object.entries(pairs)) if (value) labels[key] = value

    const html = []

    html.push(`
                <div class="text-center">${ label }</div>
                <canvas class="fl-doughnut-chart" id="${ id }"
                    data-mdb-chart-init
                    data-mdb-chart="doughnut"
                    data-mdb-dataset-label="${ label }"
                    data-mdb-labels="${ Object.entries(labels).map(([x, y]) => `${ context.localize(data.properties.value.modalities[x]) }: ${y}`) }"
                    data-mdb-dataset-data="${ Object.values(labels) }"
                    data-mdb-dataset-background-color="['rgba(63, 81, 181, 0.5)', 'rgba(77, 182, 172, 0.5)', 'rgba(66, 133, 244, 0.5)', 'rgba(156, 39, 176, 0.5)', 'rgba(233, 30, 99, 0.5)', 'rgba(66, 73, 244, 0.4)', 'rgba(66, 133, 244, 0.2)']"
                ></canvas>
                <hr>`)

    return html.join("\n")
}

export { renderChart }