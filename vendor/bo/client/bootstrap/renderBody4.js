const renderBody4 = ({ context, entity, view }, data) => {

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
    
        <div class="section">
          <div class="row">
            <div class="col-4" id="listParent"></div>
            <div class="col-3" id="chart1"></div>
            <div class="col-3" id="chartContainer2"></div>
            <div class="col-2" id="dataview"></div>
          </div>
        </div>    
      </div>
    </div>
    
    <div class="modal fade" id="listDetailModalForm" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false" aria-labelledby="listDetailModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="listDetailModalLabel"></h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" title="${context.localize("Cancel")}"></button>
          </div>
          <div class="modal-body" id="listDetailModal">
          </div>
        </div>
      </div>
    </div>
    
    <div class="modal fade" id="groupModalForm" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false" aria-labelledby="listGroupModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">${context.localize("Grouped actions")}</h5>
            <div>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close" title="${context.localize("Cancel")}">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
          </div>
          <div class="modal-body" id="groupModal">
          </div>
        </div>
      </div>
    </div>
    
    <!-- Footer -->
    ${renderFooter({ context, entity, view }, data)}`
}
