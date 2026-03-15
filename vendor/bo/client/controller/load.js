import Controller from "./Controller.js"
import Document from "../view/document/Document.js"
import Layout from "../view/layout/Layout.js"
import Navbar from "../view/navbar/Navbar.js"
import Search from "../view/search/Search.js"

const [application, tab, entity, view] = Object.values(JSON.parse(decodeURI(document.getElementById("module-script").dataset.json)))

const init = async () => {
    const controller = new Controller()

    // const document = new Document({ controller, entity: "document_cell" })
    // controller.stack(document)

    const layout = new Layout({ controller, application, tab })
    controller.stack(layout)

    // const navbar = new Navbar({ controller, application, tab })
    // controller.stack(navbar)

    // const search = new Search({ controller, entity: "account" })
    // controller.stack(search)
}
init()
