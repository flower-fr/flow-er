import View from "../View.js"

export default class ListHeaderCell extends View
{
    constructor({ controller, list, propertyId, property, orderProperty, orderDirection, translations, layout }) {
        super({ controller })
        this.list = list
        this.propertyId = propertyId
        this.property = property 
        this.orderProperty = orderProperty
        this.orderDirection = orderDirection
        this.translations = translations
        this.layout = layout
    }

    initialize = async () => {}

    render = () =>
    {
        const html = [], { list, propertyId, property, orderProperty, orderDirection, translations } = this, group = list.group

        html.push(`
            <span class="fl-modal-list-header-label">
                ${ property.label }
                <br>
                ${ (propertyId === orderProperty) ? `
                    <i class="fas ${ (orderDirection === "asc") ? "fa-arrow-down-short-wide" : "fa-arrow-down-wide-short" }"></i>
                    ${ (["date", "dateTime"].includes(property.type)) ? `
                        <span title="${ translations["Month"] }">
                            ${ (group !== "month") ? `<a id="flListHeaderAM-${ propertyId }" href="#!" class="text-primary">` : "" }/${ translations["Month"].substr(0, 1) }${ (group !== "month") ? "</a>" : "" }
                        </span>
                        <span title="${ translations["Week"] }">
                            ${ (group !== "week") ? `<a id="flListHeaderAW-${ propertyId }" href="#!" class="text-primary">` : "" }/${ translations["Week"].substr(0, 1) }${ (group !== "week") ? "</a>" : "" }
                        </span>
                        <span title="${ translations["Day"] }">
                            ${ (group !== "day") ? `<a id="flListHeaderAD-${ propertyId }" href="#!" class="text-primary">` : "" }/${ translations["Day"].substr(0, 1) }${ (group !== "day") ? "</a>" : "" }
                        </span>` : "" }` : "" }
            </span>`)

        return html.join("\n")
    }

    trigger = () => {
        const { list, propertyId, layout } = this

        let el = document.getElementById(`flListOrderButton-${propertyId}`)
        if (el) {
            el.onclick = () => {
                const direction = (propertyId === this.orderProperty && this.orderDirection === "asc") ? "desc" : "asc"
                layout.refreshList({ orderProperty: propertyId, orderDirection: direction })
            }
        }

        el = document.getElementById(`flListHeaderAM-${ propertyId }`)
        if (el) {
            el.onclick = () => {
                list.group = "month"
                document.getElementById("flList").innerHTML = list.render()
                list.trigger()
            }
        }
        el = document.getElementById(`flListHeaderAW-${ propertyId }`)
        if (el) {
            el.onclick = () => {
                list.group = "week"
                document.getElementById("flList").innerHTML = list.render()
                list.trigger()
            }
        }
        el = document.getElementById(`flListHeaderAD-${ propertyId }`)
        if (el) {
            el.onclick = () => {
                list.group = "day"
                document.getElementById("flList").innerHTML = list.render()
                list.trigger()
            }
        }
    }
}
