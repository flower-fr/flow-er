import { ModalListProperties } from "./ModalListProperties.js"

class ModalListRow
{
    constructor({ context, entity, section, config, properties, row })
    {
        this.context = context
        this.entity = entity
        this.section = section
        this.config = config
        this.properties = properties
        this.row = row
        this.modalListProperties = new ModalListProperties({ context, entity, section, config: this.config, properties, row })
    }

    render = () =>
    {
        const properties = this.properties, row = this.row

        const html = []

        html.push(`
        <tr class="fl-modal-list-row">

            ${ this.modalListProperties.render() }

        </tr>`)

        if (Object.values(properties).some((x) => x.type == "textarea")) {
            const textareaId = Object.keys(properties).find(([key, value]) => value.type == "textarea")
            html.push(`
        <tr class="fl-modal-list-row">
            <td/>
            <td colspan="${ Object.entries(properties).length }">
                ${ row[textareaId] && row[textareaId].split("\n").join("<br>") }
            </td>
        </tr>`)
        }

        return html.join("\n")
    }

    trigger = () =>
    {
    }
}

export { ModalListRow }