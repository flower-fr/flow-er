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
            <div class="modal fade" id="flModalToggle${ order }" data-mdb-backdrop="static">
                <div class="modal-dialog modal-xl">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="flModalToggleLabel${ order }">Modal ${ order }</h5>
                            <button id="flModalBtnClose" type="button" class="btn-close" data-mdb-ripple-init data-mdb-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body" id="flModalBody${ order }">
                            <div id="flModalTabs">
                                Lorem ipsum... tabs
                            </div>
                            <div id="flModalForm">
                                Lorem ipsum... form
                            </div>
                        </div>
                    </div>
                </div>
            </div>`
    }
    
    trigger = () =>
    {
        const element = document.getElementById(`flModalToggle${ this.order }`)
        element.addEventListener("hidden.mdb.modal", () => {
            this.controller.screenIndex--
        })
    }
}

export { Modal }
