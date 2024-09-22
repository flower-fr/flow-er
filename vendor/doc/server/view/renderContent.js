const renderContent = ({ context, entity, view }, content) => {

    const result = []

    for (let item of content) {
        result.push(`<div class="${ item.class }">`)
        if (item.rows) {
            for (let row of item.rows) {
                result.push(context.localize(row))
            }
        }
        if (item.widget) {
            result.push(`<input type="hidden" id="${ item.widget.id }Data" value="${ encodeURI(JSON.stringify(item.widget.data)) }" />`)
            result.push(`<div class="border rounded-5 ${item.widget.type}Widget ${ item.widget.class }" id="${ item.widget.id }"></div>`)
        }
        result.push(`</div>`)
    }

    return result.join("\n")
}

module.exports = {
    renderContent
}
