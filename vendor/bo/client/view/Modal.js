import View from "./View.js"

class Modal extends View 
{
    constructor({ controller, order }) {
        super({ controller })
        this.order = order
    }

    render = () =>
    {
        const order = this.order
        return `
            <!-- First modal dialog -->
            <div class="modal fade" id="appleeModalToggle${ order }" aria-hidden="true" aria-labelledby="appleeModalToggleLabel${ order }" tabindex="-1" data-mdb-backdrop="static">
                <div class="modal-dialog ${ order === 1 ? "modal-fullscreen" : "modal-lg" }">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="appleeModalToggleLabel${ order }">Modal ${ order }</h5>
                            <button type="button" class="btn-close" data-mdb-ripple-init data-mdb-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body" id="appleeModalBody${ order }">
                        </div>
                    </div>
                </div>
            </div>`
    }
    
    trigger = () =>
    {
        const element = document.getElementById(`appleeModalToggle${ this.order }`)
        element.addEventListener("hidden.mdb.modal", () => {
            this.controller.screenIndex--
        })
    }
}

export { Modal }
