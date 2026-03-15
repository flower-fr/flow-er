import Controller from "../../../../bo/cli/controller/Controller.js"
import Document from "../../../../bo/cli/view/document/Document.js"

const init = async () => {
    const controller = new Controller()

    const document = new Document({ controller, entity: "document_cell" })
    controller.stack(document)
}
init()
