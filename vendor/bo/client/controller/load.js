import Controller from "./Controller.js"
import Layout from "../view/layout/Layout.js"

const [application, tab, entity, view, locale] = Object.values(JSON.parse(decodeURI(document.getElementById("module-script").dataset.json)))

const init = async () => {
    const controller = new Controller()
    const layout = new Layout({ controller, application, tab, entity, view, locale })
    controller.stack(layout)
}
init()
