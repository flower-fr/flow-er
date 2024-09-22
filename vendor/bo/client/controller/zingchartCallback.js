
const zingchartCallback = ({ context, entity, view }, data) => {
    
    const series = {}, distribution = data.config.distribution.variable
    for (let row of data.rows) {
        if (!series[row[distribution]]) {
            series[row[distribution]] = { 
                values: [0],
                text: context.localize(data.properties[distribution].modalities[row[distribution]])
            }
        }
        series[row[distribution]].values[0]++
    }

    zingchart.render({
        id: "chart",
        data: {
            type: "pie",
            plot: {
              borderColor: "#2B313B",
              borderWidth: 5,
              // slice: 90,
              valueBox: {
                //placement: 'out',
                text: '%t\n%npv%',
                fontFamily: "Open Sans"
              },
              tooltip: {
                fontSize: '18',
                fontFamily: "Open Sans",
                padding: "5 10",
                text: "%npv%"
              },
              animation: {
                effect: 2,
                method: 5,
                speed: 900,
                sequence: 1,
                delay: 3000
              }
            },
            title: {
              fontColor: "#8e99a9",
              text: context.localize(data.config.title),
              align: "left",
              offsetX: 10,
              fontSize: 25
            },
            subtitle: {
              offsetX: 10,
              offsetY: 10,
              fontColor: "#8e99a9",
              fontFamily: "Open Sans",
              fontSize: "16",
              text: context.localize(data.config.subtitle),
              align: "left"
            },
            plotarea: {
              margin: "0 0 0 0"
            },
            series: Object.values(series)
          }
    })

    zingchart.plot_click = function(p) {
        $(".analysis-bloc").hide()
        $(".analysis-bloc-" + categoryCaptions[p.plottext]).show()
        $(".analysis-bloc-anchor").show()
    }
}

const zingchart2Callback = ({ context, entity, view }, data) => {
    
  const series = {}, distribution = data.config.distribution.variable
  for (let row of data.rows) {
      if (!series[row[distribution]]) {
          series[row[distribution]] = { 
              values: [0],
              text: context.localize(data.properties[distribution].modalities[row[distribution]])
          }
      }
      series[row[distribution]].values[0]++
  }

  zingchart.render({
      id: "chart2",
      data: {
          type: "pie",
          plot: {
            borderColor: "#2B313B",
            borderWidth: 5,
            slice: 90,
            valueBox: {
              //placement: 'out',
              text: '%t\n%npv%',
              fontFamily: "Open Sans"
            },
            tooltip: {
              fontSize: '18',
              fontFamily: "Open Sans",
              padding: "5 10",
              text: "%npv%"
            },
            animation: {
              effect: 2,
              method: 5,
              speed: 900,
              sequence: 1,
              delay: 3000
            }
          },
          title: {
            fontColor: "#8e99a9",
            text: context.localize(data.config.title),
            align: "left",
            offsetX: 10,
            fontSize: 25
          },
          subtitle: {
            offsetX: 10,
            offsetY: 10,
            fontColor: "#8e99a9",
            fontFamily: "Open Sans",
            fontSize: "16",
            text: context.localize(data.config.subtitle),
            align: "left"
          },
          plotarea: {
            margin: "0 0 0 0"
          },
          series: Object.values(series)
        }
  })

  zingchart.plot_click = function(p) {
      $(".analysis-bloc").hide()
      $(".analysis-bloc-" + categoryCaptions[p.plottext]).show()
      $(".analysis-bloc-anchor").show()
  }
}

