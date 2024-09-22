const renderModalListTabs = ({ context, entity, view }, { id, modalListTabsConfig }) => {
    return `<div class="container">
        <ul class="nav nav-tabs">
            ${renderModalListTabsMenu(context, modalListTabsConfig, id)}
        </ul>
        ${renderModalListTabsRoutes(context, modalListTabsConfig, id)}
        <div id="modalListForm-${id}"></div>
    </div>`
}

const renderModalListTabsMenu = function (context, modalListTabsConfig, id) {
    let defaultTab = false
    const html = []
    for (let tabId of Object.keys(modalListTabsConfig.tabs)) {
        const tab = modalListTabsConfig.tabs[tabId]
        //if (tab.key == "id" && id != 0 || !tab.key && id == 0) {
            html.push(`<li class="nav-item"><a class="nav-link modalListTab ${(!defaultTab) ? "active" : "disabled"}" id="modalListTab-${tabId}">${context.localize(tab.labels)}</a></li>`)
            defaultTab = tabId
        //}
    }
    html.push(`<input type="hidden" id="modalListDefaultTab" value="${defaultTab}">`)
    return html.join("\n")
}

const renderModalListTabsRoutes = (context, modalListTabsConfig, id) => {
    const html = []
    for (let tabId of Object.keys(modalListTabsConfig.tabs)) {
        const tab = modalListTabsConfig.tabs[tabId]
        //if (tab.key == "id" && id != 0 || !tab.key && id == 0) {
            if (tab.route) {
                const query = []
                if (tab.query) {
                    for (let key of Object.keys(tab.query)) {
                        let value = tab.query[key]
                        query.push(`${key}=${value}`)
                    }    
                }
                html.push(`<input class="${ (tab.renderer) ? tab.renderer : "renderModalListForm" }" type="hidden" id="modalListFormRoute-${tabId}" value="${tab.route}${ (id != 0) ? `/${id}` : ""}?${query.join("&")}" />
                <input type="hidden" id="modalListFormTabQuery-${tabId}" value="${query}" />`)
            }
        //}
    }
    return html.join("\n")
}
