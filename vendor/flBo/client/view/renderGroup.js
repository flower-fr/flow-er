const renderGroup = ({ context, entity, view }, { id, detailConfig }) => {
    return `<div class="container">
        <ul class="nav nav-tabs">
            ${renderGroupMenu(context, detailConfig, id)}
        </ul>
        ${renderGroupRoutes({ context, entity, view }, detailConfig, id)}
        <div id="detailPanel"></div>
    </div>`
}

const renderGroupMenu = function (context, detailConfig, id) {
    let defaultTab = false
    const html = []
    for (let tabId of Object.keys(detailConfig.tabs)) {
        const tab = detailConfig.tabs[tabId]
        //if (tab.key == "id" && id != 0 || !tab.key && id == 0) {
        html.push(`<li class="nav-item"><a class="nav-link fl-group-tab ${(!defaultTab) ? "active" : ""}" id="flGroupTab-${tabId}">${context.localize(tab.labels)}</a></li>`)
        if (!defaultTab) defaultTab = tabId
        //}
    }
    html.push(`<input type="hidden" id="flDefaultTab" value="${defaultTab}">`)
    return html.join("\n")
}

const renderGroupRoutes = ({ context, entity, view }, detailConfig, id) => {
    const html = []
    for (let tabId of Object.keys(detailConfig.tabs)) {
        const tab = detailConfig.tabs[tabId]
        //if (tab.key == "id" && id != 0 || !tab.key && id == 0) {
        if (tab.route) {
            const query = []
            if (tab.query) {
                for (let key of Object.keys(tab.query)) {
                    let value = tab.query[key]
                    query.push(`${key}=${value}`)
                }    
            }
            html.push(
                `<input class="${ (tab.renderer) ? tab.renderer : "renderUpdate" }" type="hidden" id="flGroupTabRoute-${tabId}" data-fl-controller="${tab.controller}" data-fl-action="${tab.action}" data-fl-entity="${tab.entity}" data-fl-id="${id}" data-fl-query="${query.join("&")}" value="${tab.route}${ (id && id != 0) ? `/${id}` : ""}?${query.join("&")}" />
                <input type="hidden" id="flGroupTabQuery-${tabId}" value="${query}" />
            `)
        }
        //}
    }
    return html.join("\n")
}
