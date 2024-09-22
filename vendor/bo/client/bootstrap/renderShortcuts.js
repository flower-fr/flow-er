const renderShortcuts = ({ context, entity, view }, data) => {

    const countConfig = context.config[`${entity}/count/${view}`]
    if (countConfig) {
        for (let countId of Object.keys(countConfig)) {
            let countDef = countConfig[countId]
            for (let paramId of Object.keys(countDef["filters"])) {
                const value = countDef["filters"][paramId]
                if (typeof value == "string" && value.substring(0, 5) == "today") {
                    if (value.substring(5, 6) == "+") countDef["filters"][paramId] = moment().add(value.substring(6), "days").format("YYYY-MM-DD")
                    else if (value.substring(5, 1) == "-") countDef["filters"][paramId] = moment().subtract(value.substring(6), "days").format("YYYY-MM-DD")
                    else countDef["filters"][paramId] = moment().format("YYYY-MM-DD")
                }
                if (value == "month-1") {
                    const matching = { "01": "12", "02": "01", "03": "02", "04": "03", "05": "04", "06": "05", "07": "06", "08": "07", "09": "08", "10": "09", "11": "10", "12": "11"}
                    const dateM = moment().format("MM"), dateY = moment().format("YYYY")
                    let month = Object.keys(matching)[dateM]
                    month = matching[month]
                    let year = (dateM == "01") ? parseInt(dateY) - 1 : parseInt(dateY)
                    countDef["filters"][paramId] = `${year}-${month}-01`
                }
                if (value == "month-2") {
                    const matching = { "01": "11", "02": "12", "03": "01", "04": "02", "05": "03", "06": "04", "07": "05", "08": "06", "09": "07", "10": "08", "11": "09", "12": "10" }
                    const dateM = moment().format("MM"), dateY = moment().format("YYYY")
                    let month = Object.keys(matching)[dateM]
                    month = matching[month]
                    let year = ["01", "02"].includes(dateM) ? parseInt(dateY) - 1 : parseInt(dateY)
                    countDef["filters"][paramId] = `${year}-${month}-01`
                }
            }
        }  
    }

    const renderCounts = () => {
        const html = []
        if (countConfig) {
            for (let countId of Object.keys(countConfig)) { 
                const count = countConfig[countId], params = []
                for (let propertyId of Object.keys(count["filters"])) {
                    const value = count["filters"][propertyId]
                    params.push(`${propertyId}:${value}`)
                }
                html.push(`<input type="hidden" class="shortcutsParams" id="shortcutsParams-${countId}" value="${ params.join("|") }" />
                    <div class="col-md-2 mb-2 text-center">
                      <a type="button" class="btn btn-sm btn-light position-relative" id="anchor-${countId}">
                          ${context.localize(count.labels)}&nbsp;&nbsp;<span class="flBadge position-absolute top-0 start-100 translate-middle badge bg-secondary" style="font-size: 11px" id="flBadge-${countId}">?</span>
                      </a>
                    </div>`)
            }
        
            html.push(`<div class="col-md-2 mb-2 text-center">
              <button type="button" class="btn btn-sm btn-default" title="${context.translate("Refresh")}" id="badgeRefreshButton">
                <i class="fa fa-sync-alt text-center"></i>
              </button>
            </div>`)
        }
        return html.join("\n")
    }

    return `<div class="row mb-3">${renderCounts()}</div>`
}
