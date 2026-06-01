import View from "../View.js"
export default class SidenavButton extends View
{
    constructor({ controller })
    {
        super({ controller })
    }

    render = () =>
    {
        const html = []

        html.push(`
            <div>
                <button data-mdb-ripple-init="" data-mdb-toggle="sidenav" data-mdb-target="#flSidenav" class="btn btn-primary" aria-controls="#flSidenav" aria-haspopup="true" aria-expanded="false">
                    <i class="fas fa-bars"></i>
                </button>
            </div>
            &nbsp;&nbsp;&nbsp;&nbsp;`)

        return html.join("\n")
    }
}
