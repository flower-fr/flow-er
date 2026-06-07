import Controller from "./Controller.js"
import Layout from "../view/layout/Layout.js"

const [application, tab, entity, view, theme, locale] = Object.values(JSON.parse(decodeURI(document.getElementById("module-script").dataset.json)))

const init = async () => {
    const controller = new Controller({ url: `/bo/index/${ application }/${ tab }?entity=${ entity }` })
    const layout = new Layout({ controller, application, tab, entity, view, locale, theme })
    await layout.initialize()
    $("body").html(controller.render(layout))
    controller.trigger(layout)
}
init()
