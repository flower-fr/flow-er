import View from "../View.js"

export default class ListGroup extends View
{
    constructor({ controller, identifier, list, value, property, size, translations }) {
        super({ controller })
        this.identifier = identifier
        this.list = list
        this.value = value
        this.property = property
        this.size = size
        this.translations = translations
    }

    initialize = async () => {}

    render = () =>
    {
        const html = [], { identifier, value, list, size } = this

        let label, dow
        switch (list.grouping) {
        case "month":
            label = `${ ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"][parseInt(value.substr(5, 7)) - 1] } ${ value.substr(0, 4) }`
            break
        case "week":
            label = `${ value.substr(0,4) }&nbsp;S${ moment(value).week() }`
            break
        case "day":
            dow = ["Di", "Lu", "Ma", "Me", "Je", "Ve", "Sa"][moment(value).day()]
            label = `${ dow }&nbsp;${ moment(value).format("DD/MM/YYYY") }`
            break
        default:
            label = value
            break
        }

        html.push(`
        <tbody>
            <tr class="listRow">
                <td/>
                <td class="text-center">
                    <button 
                        type="button"
                        class="btn btn-link btn-sm"
                        data-mdb-ripple-init
                        data-ripple-color="primary"
                        data-mdb-collapse-init
                        href="#flCollapse-${ identifier }"
                        role="button"
                        aria-expanded="true"
                        aria-controls="flCollapse-${ identifier }"
                        id="flButtonCollapse-${ identifier }"
                    >
                        <i class="fas fa-angle-up"></i>
                    </button>
                </td>
                <td>${ label }</td>
                <td colspan="${ size - 1 }" />
            </tr>
        </tbody>
        <tbody
            id="flCollapse-${ identifier }"
        >`)

        return html.join("\n")
    }

    trigger = () =>
    {
        const { identifier } = this
        $(`#flCollapse-${ identifier }`).each(function () {
            new mdb.Collapse($(this))
            const collapsible = document.getElementById($(this).attr("id"))
            collapsible.addEventListener("hidden.mdb.collapse", () => {
                $(`#flButtonCollapse-${ identifier }`).html("<i class=\"fas fa-angle-down\"></i>")
            })
            collapsible.addEventListener("shown.mdb.collapse", () => {
                $(`#flButtonCollapse-${ identifier }`).html("<i class=\"fas fa-angle-up\"></i>")
            })
        })
    }
}
