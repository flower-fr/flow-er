const renderHeader = ({ context, entity, view }, data) => {

    const headerParams = data.headerParams, instance = data.instance, user = data.user, applications = data.applications, applicationName = data.applicationName
    return `
	<header>
		<nav class="navbar navbar-expand-lg bg-body-tertiary">
			<div class="container-fluid">
				<button 
				  data-mdb-collapse-init
				  class="navbar-toggler"
				  type="button"
				  data-mdb-target="#navbarSupportedContent"
				  aria-controls="navbarSupportedContent"
				  aria-expanded="false"
				  aria-label="Toggle navigation"
				>
					<span class="navbar-toggler-icon"></span>
				</button>

				<!-- Collapsible wrapper -->
				<div class="collapse navbar-collapse" id="navbarSupportedContent">

					<a class="navbar-brand" href="#">	
						${(headerParams && headerParams.logo) 
        ? `<img height="${headerParams.logoHeight}" src="/${`${instance.caption }/logos/${headerParams.logo}`}" alt="${context.config["headerParams"]["title"]}" title="${context.config["headerParams"]["title"]}" />`
        : `<span>${instance.label}&nbsp;&nbsp;|</span>`}
					</a>

					<!-- Left links -->
					<ul class="navbar-nav me-auto mb-2 mb-lg-0">

						<!-- ${renderApplications(context, applications, context.localize(applicationName), data.menu)} -->
						${renderEntries({ context, entity, view }, data.menu)}

						<li class="nav-item dropdown">
							<a
							 data-mdb-dropdown-init
							 class="nav-link dropdown-toggle"
							 href="#"
							 id="navbarDropdownMenuLink"
							 role="button" 
							 aria-expanded="false"
							>
								${ context.translate("Applications") }
							</a>
							<ul class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
								${renderApplications(context, applications, context.localize(applicationName), data.menu)}
							</ul>
						</li>
      				</ul>
			    </div>

			    <!-- Right elements -->

				<div class="d-flex align-items-center">
      				<div class="dropdown">
						<a
						  data-mdb-dropdown-init
						  class="link-secondary me-3 dropdown-toggle hidden-arrow"
						  href="#"
						  id="navbarDropdownMenuLink"
						  role="button" 
						  aria-expanded="false"
						>
							<span class="far fa-lg fa-user"></span>
						</a>
						<ul class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
							<li>
								<li><a class="dropdown-item" href="#">${user.n_fn}</a></li>
								<a class="dropdown-item" href="/user/change-password">${ context.translate("Change password") }</a>
							</li>
						</ul>
					</div>

					<!-- <div>
						<a class="link-secondary me-3" title="${context.translate("Show the documentation")}">
							<span class="far fa-lg fa-question-circle"> </span>
						</a>
					</div> -->

					<div>
						<a href="/user/logout" class="link-secondary text-danger" title="${context.translate("Log out")}">
							<i class="fa-solid fa-lg fa-right-from-bracket"></i>
						</a>
					</div>

				</div>
			</div>
		</nav>
	</header>`
}

const renderEntries = ({ context, entity, view }, menu) => {
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
	
const renderApplications = (context, applications, applicationName, menu) => {
    const html = []
    for (let applicationId of Object.keys(applications)) {
        const application = applications[applicationId], tab = application.default
        const menuTab = context.config[`tab/${tab}`]
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
            const label = context.localize(application.labels)
            html.push(`<li class="nav-item">
				<a class="dropdown-item nav-link ${ (label.localeCompare(applicationName) == 0) ? "active" : "" }" href="${route}">
					${label}
				</a>
			</li>`)
        }
    }
    return html.join("\n")
}

module.exports = {
    renderHeader
}
