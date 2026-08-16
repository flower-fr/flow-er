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
        const html = [], { list, propertyId, property, orderProperty, orderDirection, translations } = this, grouping = list.grouping
        html.push(`
            <span class="fl-modal-list-header-label">
                ${ property.label }
                <br>
                ${ (propertyId === orderProperty) ? `
                    <i class="fas ${ (orderDirection === "asc") ? "fa-arrow-down-short-wide" : "fa-arrow-down-wide-short" }"></i>
                    ${ (grouping && ["date", "datetime"].includes(property.type)) ? `
                        <a id="flListHeaderAM-${ propertyId }" href="#!">
                            <span class="${ (grouping !== "month") ? "text-primary" : "text-info" } title="${ translations["Month"] }">/${ translations["Month"].substr(0, 1) }</span>
                        </a>
                        <a id="flListHeaderAW-${ propertyId }" href="#!">
                            <span class="${ (grouping !== "week") ? "text-primary" : "text-info" } title="${ translations["Week"] }">/${ translations["Week"].substr(0, 1) }</span>
                        </a>
                        <a id="flListHeaderAD-${ propertyId }" href="#!">
                            <span class="${ (grouping !== "day") ? "text-primary" : "text-info" } title="${ translations["Day"] }">/${ translations["Day"].substr(0, 1) }</span>
                        </a>
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
                list.grouping = "month"
                document.getElementById("flList").innerHTML = list.render()
                list.trigger()
            }
        }
        el = document.getElementById(`flListHeaderAW-${ propertyId }`)
        if (el) {
            el.onclick = () => {
                list.grouping = "week"
                document.getElementById("flList").innerHTML = list.render()
                list.trigger()
            }
        }
        el = document.getElementById(`flListHeaderAD-${ propertyId }`)
        if (el) {
            el.onclick = () => {
                list.grouping = "day"
                document.getElementById("flList").innerHTML = list.render()
                list.trigger()
            }
        }
    }
}
