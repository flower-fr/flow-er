const renderMenu = ({ context, view }, data) => 
{
    const menu = data.menu

    return `<div id="main_menu">
		<ul class="nav nav-pills nav-justified flex-column flex-sm-row">
			${renderEntries({ context, view }, menu)}
		</ul>
	</div>`
}

const renderEntries = ({ context, view }, menu) => 
{
    const html = []
    for (let menuTabId of Object.keys(menu)) {
        const menuTab = menu[menuTabId]
        //if (context.isAllowed(menuTab.route)) {
            const query = menuTab.urlParams
            const active = (menuTabId == `tab/${view}`)

            html.push(`<li class="nav-item">
				<a class="nav-link ${(active) ? "active" : ""} ${(menuTab.disabled) ? "btn disabled" : ""}" href="${`${menuTab.route}${(query) ? `?${query}` : ""}`}" id="${menuTabId}-anchor">
					${context.localize(menuTab.labels)}
				</a>
			</li>`)
        //}
    }
    return html.join("\n")
}
