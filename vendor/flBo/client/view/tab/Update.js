class Update
{
    constructor({ context, entity, view, id })
    {
        this.context = context
        this.entity = entity
        this.view = view
        this.id = id
    }

    render = () =>
    {
        const html = []

        return html.join("\n")
    }

    trigger = () =>
    {
    }
}

export { Update }