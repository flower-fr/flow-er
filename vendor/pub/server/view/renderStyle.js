
const renderStyle = ({ context, entity, view }, { formConfig }) => {

    const html = ["<style>"]

    if (formConfig.style) {
        for (let selector of Object.keys(formConfig.style)) {
            const style = formConfig.style[selector]
            html.push(`${selector} ${style}`)
        }    
    }

    html.push("</style>")
    return html.join("\n")
}

module.exports = {
    renderStyle
}
