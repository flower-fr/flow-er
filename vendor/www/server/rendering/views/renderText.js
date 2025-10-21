const renderText = (context, site, section) => 
{
    const textConfig = context.config[`${ site }/text/${ section }`], html = []

    html.push(`
        <section id="solution">`)

    for (const paragraph of textConfig) {
        html.push(context.localize(paragraph))
    }

    html.push(`
       </section>`)
    
    return html.join("\n")
}

module.exports = {
    renderText
}