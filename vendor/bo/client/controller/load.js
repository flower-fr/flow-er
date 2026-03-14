import Controller from "./Controller.js"
import Navbar from "../view/navbar/Navbar.js"
import Document from "../view/document/Document.js"

const [application, tab] = Object.values(JSON.parse(decodeURI(document.getElementById("module-script").dataset.json)))

const init = async () => {
    const controller = new Controller()
    // const navbar = new Navbar({ controller, application, tab })
    const document = new Document({ controller, entity: "document_cell" })
    // controller.stack(navbar)
    controller.stack(document)
}
init()
