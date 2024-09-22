const renderMenu = ({ context, entity, view }, menu) => {

    let show = false
    for (let item of menu.items) {
        const menuView = item.route.split("/")[4]
        if (menuView == view) {
            show = true
            break
        }
    }

    const result = [
        `<li class="sidenav-item">
            <a class="sidenav-link"><i class="fas ${ context.localize(menu.icon) } fa-fw me-3"></i><span>${ context.localize(menu.labels) }</span></a>
            <ul class="sidenav-collapse ${ (show) ? "show" : "" }">`]

    for (let item of menu.items) {

        const menuView = item.route.split("/")[4]

        result.push(`<li class="sidenav-item ${ (menuView == view) ? "text-primary" : "" }"><a href="${ item.route }" class="sidenav-link">${ context.localize(item.labels) }</a></li>`)
    }

    result.push(`</ul></li>`)

    return result.join("\n")
}

const renderSidenav = ({ context, entity, view }, sidenav) => {

    const result = [`
        <!-- Sidenav-->
        <nav
            data-mdb-sidenav-init
            id="sidenav-6"
            class="sidenav"
            data-mdb-accordion="true"
            style="padding-bottom : 100px"
        >
            <ul class="sidenav-menu">
                <li class="sidenav-item">
                    <img class="sidenav-link h-auto" src="/flow-er/logos/flow-er-3.png" alt="" style="width: 150px;">
                </li>
            </ul>
            <hr/>

            <ul class="sidenav-menu">`
    ]

    for (let item of sidenav) {
        if (item.level == "menu") {
            result.push(renderMenu({ context, entity, view }, item))
        }
    }

    result.push(`</ul>
        </nav>

        <!-- Sidenav-->

        <div class="container mb-5 mt-5">
            <!-- Toggler -->
            <button
                data-mdb-ripple-init
                data-mdb-toggle="sidenav"
                data-mdb-target="#sidenav-6"
                class="btn btn-primary"
                aria-controls="#sidenav-6"
                aria-haspopup="true"
            >
                <i class="fas fa-bars"></i>
            </button>
            <!-- Toggler -->
        </div>`)

    return result.join("\n")
}

module.exports = {
    renderSidenav
}
