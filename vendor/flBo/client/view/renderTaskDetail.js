const renderTaskDetail = ({ context, entity, view }, data, formJwt) => {

    console.log("In renderTaskDetail (flBo)")

    const html = []

    html.push(`
                    
        <form class="row g-4 was-validated" id="flModalForm" style="margin-left: 0; margin-right:0">

            <input type="hidden" id="formJwt" name="formJwt" value="${ formJwt }" />
            <input type="hidden" class="fl-modal-form-input" data-fl-property="id" data-fl-type="input" value="${ data.id }" />

            <div class="modal-header">
                <h5 class="modal-title id="flModalTaskLabel">${ context.translate("Modify a task") }</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" data-mdb-dismiss="modal" aria-label="Close"></button>
            </div>

            <div class="modal-body">

                <div class="fl-modal-message" id="flModalMessageOk">
                    <h5 class="alert alert-success text-center">${context.translate("Your request has been registered")}</h5>
                </div>

                <section class="summary-section">
                    <div class="form-outline my-3 formOutline" data-mdb-input-init="" data-mdb-input-initialized="true">
                        <input type="text" class="form-control form-control-sm calendar-summary-input fl-modal-form-input" data-fl-property="summary" data-fl-type="input" value="${ data.summary }">
                        <label class="form-label" style="margin-left: 0px;">Résumé</label>
                    </div>
                    <div class="text-center"><small> ${ (data.n_fn) ? data.n_fn : "" } ${ (data.business_name) ? data.business_name : "" } ${ (data.email) ? `<a href="mailto:${ data.email }"><i class="fa fa-at"></i>&nbsp;&nbsp;${ data.email }</a>` : "" }&nbsp;&nbsp;&nbsp;&nbsp;${ (data.tel_cell) ? `<a href="tel:${ data.tel_cell }"><i class="fa fa-mobile-screen-button"></i>&nbsp;&nbsp;${ data.tel_cell }</a>` : "" }</small></div>
                </section>
                <div class="form-floating form-outline my-3 formOutline" data-mdb-input-init="" data-mdb-input-initialized="true">
                    <textarea type="text" class="form-control form-control-sm fl-modal-form-input" data-fl-property="description" data-fl-type="textarea">${ (data.description) ? data.description : "" }</textarea>
                    <label class="form-label" style="margin-left: 0px;">
                        Description
                    </label>
                </div>
                <div class="d-flex justify-content-between">
                    <div class="form-check mx-2">
                        <input class="form-check-input calendar-long-events-checkbox fl-modal-form-check" data-fl-property="status" data-fl-unchecked-value="todo" data-fl-checked-value="done" type="checkbox" ${ (data.status == "done") ? "checked" : "" }>
                        <label class="form-check-label" for="status">
                            ${ context.translate("Done task") }
                        </label>
                    </div>
                </div>
                <section class="long-event-section">
                    <div class="form-floating form-outline my-3 fl-date-outline" data-fl-container="flModal" data-mdb-datepicker-init data-mdb-input-init data-mdb-inline="true"> 
                        <input type="text" name="start.date" class="form-control form-control-sm calendar-date-input active form-icon-trailing fl-modal-form-input" data-fl-property="date" data-fl-type="date" value="${ context.decodeDate(data.date) }">
                        <label class="form-label" style="margin-left: 0px;">
                            ${ context.translate("Date") }
                        </label>
                        <button id="datepicker-toggle-409550" type="button" class="datepicker-toggle-button" data-mdb-toggle="datepicker">
                            <i class="far fa-calendar datepicker-toggle-icon"></i>
                        </button>
                    </div>
                </section>
                <section class="long-event-section">
                    <div class="form-floating form-outline my-3 fl-time-outline" data-fl-container="flModal" data-mdb-datepicker-init data-mdb-input-init> 
                        <input type="text" class="form-control form-control-sm fl-modal-form-input" data-fl-property="time" data-fl-type="time" value="${ (data.time) ? data.time : "" }" />
                        <label class="form-label" style="margin-left: 0px;">
                            ${ context.translate("Time") }
                        </label>
                    </div>
                </section>
            </div>
            <div class="modal-footer">
                <input type="submit" class="btn btn-warning fl-task-submit" data-fl-controller="core" data-fl-action="v1" data-fl-entity="${entity}" value="${ context.translate("Modify") }" />
                <button type="button" class="btn btn-sm btn-outline-primary index-btn fl-task-delete" title="${context.translate("Delete")}" data-mdb-ripple-init>
                    <span class="fas fa-trash-alt"></span>
                </button>
            </div>
            
        </form>`)

    return html.join("\n")
}
