const renderHeader = ({ context }, data) => {

    const headerParams = data.headerParams, instance = data.instance
    return `<header>
		<nav class="navbar navbar-expand-lg bg-body-tertiary">
			<div class="container-fluid">
				<a class="navbar-brand" href="/">	
					${(headerParams && headerParams.logo) 
        ? `<img height="${headerParams.logoHeight}" src="/${`${instance.caption }/logos/${headerParams.logo}`}" alt="${context.config["headerParams"]["title"]}" title="${context.config["headerParams"]["title"]}" />`
        : `<span>${instance.label}&nbsp;&nbsp;|</span>`}
				</a>

				<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
					<span class="navbar-toggler-icon"></span>
				</button>
				<div class="collapse navbar-collapse" id="navbarSupportedContent">
				</div>
			</div>
		</nav>
	</header>`
}

module.exports = {
    renderHeader
}
