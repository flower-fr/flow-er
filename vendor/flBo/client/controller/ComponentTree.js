class ComponentTree
{
    static views = new Object

    static registerView = (id, view) =>
    {
        this.views[id] = view
    }

    static loadView = (id) => 
    {
        const view = this.views[id], html = []
        $("#detailPanel").html(view.render(html).join("\n"))
        view.style()
        view.trigger()
    }
}

export { ComponentTree }
