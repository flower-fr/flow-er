const renderTaskAdd = ({ context, entity, view }, {properties }, formJwt) => {

    const html = []
    const account_idValues = properties.account_id.modalities.map( x => x.n_fn )
    const accountIds = properties.account_id.modalities.map( x => x.id )

    html.push(`

        <form class="row g-4" id="flModalForm" style="margin-left: 0; margin-right:0" was-validated>

            <input type="hidden" id="formJwt" value="${ formJwt }" />
            <input type="hidden" class="fl-modal-form-input" data-fl-property="status" data-fl-type="input" value="todo" />

            <div class="modal-header">
                <h5 class="modal-title id="flModalTaskLabel">${ context.translate("Add a task") }</h5>
                <button type="button" class="btn-close" data-mdb-dismiss="modal" aria-label="Close"></button>
            </div>

            <div class="modal-body">

                <div class="fl-modal-message" id="flModalMessageOk">
                    <h5 class="alert alert-success text-center">${context.translate("Your request has been registered")}</h5>
                </div>

                <section class="account_id-section">
                    <div class="form-outline my-3" data-fl-container="flModal" data-fl-values="${ account_idValues.join(",") }" data-mdb-input-init="" data-mdb-input-initialized="true">
                        <input type="text" class="form-control fl-modal-form-input" data-fl-property="account_id" data-fl-type="input" data-fl-values="${ account_idValues.join(",") }" data-fl-ids="${ accountIds.join(",") }">
                        <label class="form-label" style="margin-left: 0px;">Prospect concerné</label>
                    </div>
                </section>
                <section class="summary-section">
                    <div class="form-outline my-3" data-mdb-input-init="" data-mdb-input-initialized="true">
                        <input type="text" class="form-control calendar-summary-input fl-modal-form-input" data-fl-property="summary" data-fl-type="input" required>
                        <label class="form-label" style="margin-left: 0px;">Résumé</label>
                    </div>
                </section>
                <div class="form-outline my-3" data-mdb-input-init="" data-mdb-input-initialized="true">
                    <textarea type="text" class="form-control fl-modal-form-input" data-fl-property="description" data-fl-type="textarea"></textarea>
                    <label class="form-label" style="margin-left: 0px;">
                        Description
                    </label>
                </div>
                <section class="long-event-section">
                    <div class="form-outline my-3 fl-date-outline" data-fl-container="flModal" data-mdb-datepicker-init data-mdb-input-init data-mdb-inline="true"> 
                        <input type="text" class="form-control calendar-date-input active form-icon-trailing fl-modal-form-input" data-fl-property="date" data-fl-type="date" value="${ context.decodeDate(moment().add(1, "days").format("YYYY-MM-DD")) }" required>
                        <label class="form-label" style="margin-left: 0px;">
                            ${ context.translate("Date") }
                        </label>
                        <button id="datepicker-toggle-409550" type="button" class="datepicker-toggle-button" data-mdb-toggle="datepicker">
                            <i class="far fa-calendar datepicker-toggle-icon"></i>
                        </button>
                    </div>
                </section>
            </div>
            <div class="modal-footer">
                <input type="submit" class="btn btn-warning fl-task-submit" data-fl-controller="bo" data-fl-action="v1" data-fl-entity="crm_task" value="${ context.translate("Add") }" />
            </div>
        
        </form>`)

    return html.join("\n")
}
