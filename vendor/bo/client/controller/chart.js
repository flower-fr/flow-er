
function renderChart(series, text) {
    zingchart.render({
        id: "chart",
        data: {
            type: 'bar',
            title: {
                text: 'Data Basics',
                fontSize: 24,
            },
            legend: {
                draggable: true,
            },
            scaleX: {
            // Set scale label
                label: { text: 'Days' },
                // Convert text on scale indices
                labels: [ 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun' ]
            },
            scaleY: {
            // Scale label with unicode character
                label: { text: 'Temperature (°F)' }
            },
            plot: {
            // Animation docs here:
            // https://www.zingchart.com/docs/tutorials/styling/animation#effect
                animation: {
                    effect: 'ANIMATION_EXPAND_BOTTOM',
                    method: 'ANIMATION_STRONG_EASE_OUT',
                    sequence: 'ANIMATION_BY_NODE',
                    speed: 275,
                }
            },
            series: series
        }
    })

    zingchart.plot_click = function(p) {
        $(".analysis-bloc").hide()
        $(".analysis-bloc-" + categoryCaptions[p.plottext]).show()
        $(".analysis-bloc-anchor").show()
    }
};

function displayChart(context, entity, view) {
    const series = [
        {
        // plot 1 values, linear data
            values: [23,20,27,29,25,17,15],
            text: 'Week 1',
        },
        {
        // plot 2 values, linear data
            values: [35,42,33,49,35,47,35],
            text: 'Week 2'
        },
        {
        // plot 2 values, linear data
            values: [15,22,13,33,44,27,31],
            text: 'Week 3'
        }
    ]
    renderChart(series, "Titre")
}
