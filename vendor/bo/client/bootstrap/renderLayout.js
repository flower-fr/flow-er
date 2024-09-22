const renderLayout = ({ context }, { config, properties, row }) => {

    const result = []

    for (let markup of config) {
        const args = []
        for (let param of (markup.params) ? markup.params.split(",") : []) {
            const property = properties[param]
            if (property.type == "select") {
                args.push((row[param]) ? context.localize(property.modalities[row[param]]) : "")
            }
            else if (property.type == "date") {
                args.push(context.decodeDate(row[param]))
            }
            else if (property.type == "datetime") {
                args.push(context.decodeTime(row[param]))
            }
            else if (property.type == "email") {
                args.push(`<a href=\"mailto:${row[param]}\" class=\"card-link\">${row[param]}</a>`)
            }
            else if (property.type == "phone") {
                args.push(`<a href=\"tel:${row[param]}\" class=\"card-link\">${row[param]}</a>`)
            }
            else {
                args.push(row[param])
            }
        }
        const format = markup.format.split("%s")
        const text = []
        for (let i = 0; i < format.length; i++) {
            text.push(format[i])
            if (i < args.length) text.push(args[i])
        }
        result.push(text.join(""))
    }

    return result.join("\n")
}
