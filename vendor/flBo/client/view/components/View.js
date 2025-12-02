class View
{
    constructor({ type: type = "div", id, classes, views }) 
    {
        this.type = type
        this.id = id
        this.classes = classes
        this.views = views
    }

    render = (html) => 
    {
        html.push(`
            <${this.type} class="${this.classes}" id="${ this.id }">`)

        html = this.renderChildren(html)

        html.push(`
            </${this.type}>`)

        return html
    }

    renderChildren(html) 
    {
        for (let view of this.views) {
            html.push(view.render(html))
        }
        return html
    }

    style = () => 
    {
        for (const view of this.views) {
            view.style()
        }
    }

    trigger = (args) => {
        for (const view of this.views) {
            view.trigger(args)
        }
    }
}

export { View }