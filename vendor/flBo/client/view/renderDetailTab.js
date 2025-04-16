const renderDetailTab = ({ context, entity }, { data, detailTabConfig, formJwt }) => {

    console.log("in renderDetailTab (flBo)")

    const renderers = { renderModalList: renderModalList, renderUpdate: renderUpdate, renderDocumentSection: renderDocumentSection, renderGlobalTable: renderGlobalTable }

    const layout = detailTabConfig.layout

    const html = []

    html.push(
        `<div class="my-3 mt-5">

            <input type="hidden" id="formJwt" name="formJwt" value="${ formJwt }" />

            <!-- Form status messages -->

            <div class="fl-detail-tab-message" id="flDetailTabMessageOk">
                <h5 class="alert alert-success my-5 text-center">${context.translate("Your request has been registered")}</h5>
            </div>

            <div class="fl-detail-tab-message" id="flDetailTabMessageExpired">
                <h5 class="alert alert-danger my-3 text-center">${context.translate("The form has expired, please input again")}</h5>
            </div>

            <div class="fl-detail-tab-message" id="flDetailTabMessageConsistency">
                <h5 class="alert alert-danger  my-3 text-center">${context.translate("The database has evolved in the meantime, please input again")}</h5>
            </div>

            <div class="fl-detail-tab-message" id="flDetailTabMessageDuplicate">
                <h5 class="alert alert-danger  my-3 text-center">${context.translate("The data already exists")}</h5>
            </div>

            <div class="fl-detail-tab-message" id="flDetailTabMessageServerError">
                <h5 class="alert alert-danger  my-3 text-center">${context.translate("A technical error has occured. PLease try again later")}</h5>
            </div>
            
            <form class="row g-4" id="flModalForm">

                <div class="row">`
    )

    if (layout.cols) {
        html.push(
            `       <div class="${ layout.cols.content.class || "col-md-8" }">
                        <div
                            class="row"
                            id="flModalScrollspyDiv"
                            data-mdb-scrollspy-init
                            data-mdb-target="#flModalScrollspy"

                            style="position: relative; overflow: auto;"
                        >`
        )
    }
    
    for (const [sectionId, section] of Object.entries(layout.sections)) {

        /**
         * Display of section is conditionned to given parameter vs config rule
         */

        const sectionData = data[section.entity]
        let condition = false
        if (!section.condition) condition = true
        else {
            if (section.condition[0] == "!") {
                const rest = section.condition.substring(1)
                if (!data.where[rest] || data.where[rest] == 0) condition = true
            }
            else if (data.where[section.condition] && data.where[section.condition] != 0) condition = true
        }
        if (!sectionData || condition) {

            if (section.renderer == "renderDocument") {
                const config = context.config[section.config]
                html.push(renderDocument({ context, entity }, { data, config }))
                continue
            }
    
            const properties = {}
            for (const propertyId of section.properties) properties[propertyId] = sectionData.properties[propertyId]

            const rows = sectionData.rows, where = data.where, order = data.order, limit = sectionData.limit
            html.push(
                `${ (section.renderer == "renderUpdate") ?
                    (renderers[section.renderer])({ context, entity }, section, properties, (rows.length > 0) ? rows[0] : [{}]) :
                    (renderers[section.renderer])({ context, entity }, { id: data.id, section, config: detailTabConfig, properties, rows, where, order, limit }) }
                `
            )
        }
    }

    if (layout.cols) {
        html.push(
            `           </div>
                    </div>

                    <div class="${ layout.cols.scrollspy.class || "col-md-4" }">
                        <!-- Scrollspy -->
                        <div id="modal-scrollspy" class="sticky-top scrollspy">
                            <ul class="nav flex-column nav-pills menu-sidebar">`
        )

        for (let sectionId of Object.keys(layout.sections)) {
            const section = layout.sections[sectionId]
            if (section.labels) {
                html.push(
                    `           <li class="nav-item">
                                    <a class="nav-link" href="#${sectionId}">${context.localize(section.labels)}</a>
                                </li>`
                )
            }
        }

        html.push(
            `               </ul>
                        </div>
                        <!-- Scrollspy -->
                    </div>
                    <!-- col -->
                </div>
                <!-- row -->`
        )
    }

    html.push(`
                <div class="form-group row submitDiv">`)

    for (const [postId, post] of Object.entries(layout.posts)) {
        if (!post.condition && data.id == 0 || post.condition == "id" && data.id != 0) {
            const where = []
            for (const [key, value] of Object.entries((data.where) ? data.where : {})) {
                where.push(`${key}:${ Array.isArray(value) ? value.join(",") : value }`)
            }
            html.push(`
                    <div class="col-md-2 fl-submit-div">
                        <input type="hidden" id="flDetailTabSubmitRefresh-${postId}" data-fl-route="/${ detailTabConfig.controller }/${ detailTabConfig.action }/${ detailTabConfig.entity }/${ data.id }?where=${ where.join("|") }&order=${ data.order }" />
                        <button name="submit-${postId}" class="btn ${ (post.danger) ? "btn-outline-primary" : "btn-warning" } fl-detail-tab-submit" ${ (post.danger) ? "data-fl-danger=\"danger\"" : "" } ${ (post.method) ? `data-fl-method=${post.method}`: "" } data-fl-controller=${post.controller} data-fl-action=${post.action} data-fl-entity=${post.entity} ${ (post.id) ? `data-fl-id=${ data[post.id] }`: "" } data-fl-transaction=${postId} ${ (post.view) ? `data-fl-view=${post.view}` : "" } ${ (post.glyph) ? `title=${  context.localize(post.labels) }` : "" }>${ (post.glyph) ? `<i class="fas ${ post.glyph }"></i>` : context.localize(post.labels) }</button>
                    </div>`)
        }
    }
    html.push(
        `    </div>
        </form>
    </div>`
    )

    return html.join("\n")
}
