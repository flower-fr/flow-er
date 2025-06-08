const renderDetail = ({ context, entity, view }, { id, detailConfig }) => {

    console.log("in renderDetail (flBo)")

    return `<div class="container">
        <ul class="nav nav-tabs">
            ${renderDetailMenu(context, detailConfig, id)}
        </ul>
        ${renderDetailRoutes({ context, entity, view }, detailConfig, id)}
        <div id="detailPanel"></div>
    </div>`
}

const renderDetailMenu = function (context, detailConfig, id) {
    let defaultTab = false
    const html = []
    for (let [tabId, tab] of Object.entries(detailConfig.tabs)) {

        let condition = false
        if (!tab.condition) condition = true
        else {
            if (tab.condition[0] == "!" && id == 0) condition = true
            else if (id != 0) condition = true
        }

        if (condition) {
            html.push(`<li class="nav-item"><a class="nav-link detailTab ${(!defaultTab) ? "active" : ""}" id="detailTab-${tabId}">${context.localize(tab.labels)}</a></li>`)
            if (!defaultTab) defaultTab = tabId
        }
    }
    html.push(`<input type="hidden" id="defaultTab" value="${defaultTab}">`)
    return html.join("\n")
}

const renderDetailRoutes = ({ context, entity, view }, detailConfig, id) => {
    const html = []
    for (let tabId of Object.keys(detailConfig.tabs)) {
        const tab = detailConfig.tabs[tabId]
        //if (tab.key == "id" && id != 0 || !tab.key && id == 0) {
        let route = ""
        if (tab.route) {
            route = `${tab.route}${ (id && id != 0) ? `/${id}` : ""}`
        }
        else {
            route = `/${tab.controller}/${tab.action}/${tab.entity}/${ (tab.id == "id") ? id : tab.id }`
        }
        if (route) {
            const query = []
            if (tab.query) {
                for (let key of Object.keys(tab.query)) {
                    let value = tab.query[key]
                    if (key == "where") {
                        let map = []
                        for (let [key, val] of Object.entries(value)) {
                            if (val == "id") val = id
                            map.push(`${key}:${val}`)
                        }
                        value = map.join("|")
                    }
                    query.push(`${key}=${value}`)
                }    
            }
            html.push(`<input class="${ (tab.renderer) ? tab.renderer : "renderUpdate" }" type="hidden" id="detailTabRoute-${tabId}" value="${route}?${query.join("&")}" />
                <input type="hidden" id="detailTabQuery-${tabId}" value="${query}" />`)
        }
        //}
    }
    return html.join("\n")
}
