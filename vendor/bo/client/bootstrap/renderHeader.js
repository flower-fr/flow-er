const renderHeader = ({ context }, data) => {

    const headerParams = data.headerParams, instance = data.instance, user = data.user, applications = data.applications, applicationName = data.applicationName

    return `<header>
		<nav class="navbar navbar-expand-lg bg-body-tertiary">
			<div class="container-fluid">
				<a class="navbar-brand" href="#">	
					${(headerParams && headerParams.logo) 
        ? `<img height="${headerParams.logoHeight}" src="/${`${instance.caption }/logos/${headerParams.logo}`}" alt="${context.config["headerParams"]["title"]}" title="${context.config["headerParams"]["title"]}" />`
        : `<span>${instance.label}&nbsp;&nbsp;|</span>`}
				</a>

				<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
					<span class="navbar-toggler-icon"></span>
				</button>
				<div class="collapse navbar-collapse" id="navbarSupportedContent">
					<ul class="navbar-nav me-auto mb-2 mb-lg-0">

						${renderApplications(context, applications, context.localize(applicationName))}

						<li class="nav-item dropdown">
							<a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
								<span class="far fa-lg fa-user"></span>
							</a>
							<ul class="dropdown-menu">
								<li><a class="dropdown-item" href="#">${user.formattedName}</a></li>
								<li><hr class="dropdown-divider"></li>
								<li><a class="dropdown-item" id="logoutAnchor" href="#">${context.translate("Logout")}</a></li>
							</ul>
						</li>

						<li class="nav-item">
							<a class="nav-link" title="${context.translate("Show the documentation")}">
								<span class="far fa-lg fa-question-circle"> </span>
							</a>
						</li>

					</ul>
				</div>
			</div>
		</nav>
	</header>`
}

const renderApplications = (context, applications, applicationName) => {
    const html = []
    for (let applicationId of Object.keys(applications)) {
        const application = applications[applicationId]
        const label = context.localize(application.labels)
        html.push(`<li class="nav-item">
			<a class="nav-link ${ (label.localeCompare(applicationName) == 0) ? "active" : "" }" href="${application.url}">
				${label}
			</a>
		</li>`)
    }
    return html.join("\n")
}
