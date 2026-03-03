import Controller from "./Controller.js"
import Navbar from "../view/navbar/Navbar.js"

const [application, tab, entity, view] = Object.values(JSON.parse(decodeURI(document.getElementById("module-script").dataset.json)))

const init = async () => {
    const controller = new Controller()
    const navbar = new Navbar({ controller, application, tab })
    controller.stack(navbar)
}
init()
