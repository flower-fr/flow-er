const renderBody12 = ({ context, entity, view }, data) => {

    return `
    
      ${renderHiddenRoutes({ context, entity, view }, data)}
    
      <!-- Header -->
      <div id="headerDiv">
          ${renderHeader({ context, entity, view }, data)}
      </div>
    
    <div class="m-3">

      <div class="row">

          ${renderMenu({ context, entity, view }, data)}
      
      </div>

      <div class="row">
          <div class="section mt-3" id="shortcutsPanel"></div>
          <div class="section" id="dataview"></div>
      </div>
    </div>
    
    <div class="modal fade" id="listDetailModalForm" tabindex="-1" role="dialog" data-backdrop="static" aria-labelledby="listDetailModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="listDetailModalLabel"></h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" data-mdb-dismiss="modal" aria-label="Close" title="${context.localize("Cancel")}"></button>
          </div>
          <div class="modal-body" id="listDetailModal">
          </div>
        </div>
      </div>
    </div>
    
    <!-- Footer -->
    ${renderFooter({ context, entity, view }, data)}`
}
