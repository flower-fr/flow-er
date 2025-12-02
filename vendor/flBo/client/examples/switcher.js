import { Form } from '../view/components/Form.js'
import { Input } from '../view/components/Input.js'
import { Submit } from '../view/components/Submit.js'
import { View } from '../view/components/View.js'

class FormExample extends Form
{
    constructor({ submit })
    {
        const views = [
            new View({
                classes: "row",
                views: [
                    new View({
                        classes: "col-md-8",
                        views: [
                            new Input({id: "n_first", property: "n_first", label: "Prénom"}),
                            new Input({id: "n_last", property: "n_last", label: "Nom"}),
                        ]
                    }),
                ],
            }),
            new View({
                classes: "row",
                views: [
                    new View({
                        classes: "form-group row my-4",
                        views: [
                            new Submit({ value: "Switcher" }),
                        ]
                    }),
                ],
            }),
        ]
        super({ id: "flModalForm", views, submit })
    }
}

class FormExample2 extends Form
{
    constructor({ submit })
    {
        const views = [
            new View({
                classes: "row",
                views: [
                    new View({
                        classes: "col-md-8",
                        views: [
                            new Input({id: "email", property: "n_first", label: "Email"}),
                            new Input({id: "tel_cell", property: "n_last", label: "Téléphone"}),
                        ]
                    }),
                ],
            }),
            new View({
                classes: "row",
                views: [
                    new View({
                        classes: "form-group row my-4",
                        views: [
                            new Submit({ value: "Switcher" }),
                        ]
                    }),
                ],
            }),
        ]
        super({ id: "flModalForm2", views, submit })
    }
}

let view, view2
let pairs = {}, pairs2 = {}

const switcher = (view, pairs) =>
{
    const dom = $("#flMainContent").html()
    const html = []
    $("#flMainContent").html(view.render(html).join("\n"))
    for (const [id, value] of Object.entries(pairs)) {
        $(`#${id}`).val(value)
    }
    view.style()
    view.trigger()
}

const poc = () =>
{
    pairs = {}
    $(".fl-modal-form-input").each(function () {
        const id = $(this).attr("id"), value = $(this).val()
        pairs[id] = value
    })
    switcher(view2, pairs2)
}

const poc2 = () =>
{
    pairs2 = {}
    $(".fl-modal-form-input").each(function () {
        const id = $(this).attr("id"), value = $(this).val()
        pairs2[id] = value
    })
    switcher(view, pairs)
}

view = new FormExample({ submit: poc }), view2 = new FormExample2({ submit: poc2 })

const loadSwitcher = (view) => 
{
    const html = []
    $("#flMainContent").html(view.render(html).join("\n"))
    view.style()
    view.trigger()
}

loadSwitcher(view)
