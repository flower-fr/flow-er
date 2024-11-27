const renderMenu = ({ context, entity, view }, data) => 
{
    const menu = data.menu

    return `<div id="main_menu">
		<ul class="nav nav-pills nav-justified flex-column flex-sm-row">
			${renderEntries({ context, entity, view }, menu)}
		</ul>
	</div>`
}

const renderEntries = ({ context, entity, view }, menu) => 
{
    const html = []
    for (let menuTabId of Object.keys(menu)) {
        const menuTab = menu[menuTabId]

        let route, allowed
        if (menuTab.controller) {
            route = `/${menuTab.controller}/${menuTab.action}/${menuTab.entity}`
            if (menuTab.view) route += `?view=${menuTab.view}`
            allowed = context.isAllowed(menuTab.entity, menuTab.view)
        }
        else {
            const query = menuTab.urlParams
            route = `${menuTab.route}${(query) ? `?${query}` : ""}`
            allowed = true
        }

        if (allowed) {
            const active = (menuTabId == `tab/${view}`)

            html.push(`<li class="nav-item">
				<a class="nav-link ${(active) ? "active" : ""} ${(menuTab.disabled) ? "btn disabled" : ""}" href="${route}" id="${menuTabId}-anchor">
					${context.localize(menuTab.labels)}
				</a>
			</li>`)
        }
    }
    return html.join("\n")
}

module.exports = {
    renderMenu
}
