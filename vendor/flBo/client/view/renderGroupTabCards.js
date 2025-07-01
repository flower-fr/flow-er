const renderGroupTabCards = ({ context, entity }, { groupTabConfig, properties, row, where, formJwt }, payload) => {

    const layout = groupTabConfig.layout

    const html = []

    html.push(
        `<div class="my-3 mt-5" id="tabDiv">

            <input type="hidden" id="formJwt" name="formJwt" value="${ formJwt }" />

            <!-- Form status messages -->

            <div class="fl-group-tab-message" id="updateMessageOk">
                <h5 class="alert alert-success my-5 text-center">${context.translate("Your request has been registered")}</h5>
            </div>

            <div class="fl-group-tab-message" id="updateMessageExpired">
                <h5 class="alert alert-danger my-3 text-center">${context.translate("The form has expired, please input again")}</h5>
            </div>

            <div class="fl-group-tab-message" id="updateMessageConsistency">
                <h5 class="alert alert-danger  my-3 text-center">${context.translate("The database has evolved in the meantime, please input again")}</h5>
            </div>

            <div class="fl-group-tab-message" id="updateMessageDuplicate">
                <h5 class="alert alert-danger  my-3 text-center">${context.translate("The data already exists")}</h5>
            </div>

            <div class="fl-group-tab-message" id="updateMessageServerError">
                <h5 class="alert alert-danger  my-3 text-center">${context.translate("A technical error has occured. PLease try again later")}</h5>
            </div>
            
            <form class="was-validated row g-4" id="tabForm">

                <div class="row">`
    )

    if (layout.cols) {
        html.push(
            `       <div class="${ layout.cols.content.class || "col-md-8" }">
                        <div
                            id="modal-scrollspy-div"
                            data-mdb-scrollspy-init
                            data-mdb-target="#modal-scrollspy"
                        >`
        )
    }
    
    for (let sectionId of Object.keys(layout.sections)) {
        const section = layout.sections[sectionId]
        html.push(
            `<section id="${sectionId}">
                ${ (section.labels) ? `<h5 class="my-4">${context.localize(section.labels)}</h5>`: "" }
                <div class="row">
                    ${ renderGroupTab({ context, entity }, section, properties, row, payload) }
                </div>
            </section>`
        )
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

    html.push("<div class=\"form-group row my-4 fl-submit-div\">")

    for (let [postId, post] of Object.entries(layout.posts)) {
        let id
        if (post.id && post.id[0] == "?" && where[post.id.substring(1)]) {
            id = where[post.id.substring(1)][0]
        }
        html.push(
            `   <div>
                    <input 
                        name="submit-${postId}" 
                        type="submit" 
                        id="submitButton-${postId}" 
                        class="btn btn-warning fl-group-tab-submit mt-3" 
                        value="${ context.localize(post.labels) }" 
                        data-controller=${post.controller} 
                        data-action=${post.action} 
                        data-entity=${post.entity} 
                        data-transaction=${postId}
                        ${ (post.key) ? `
                            data-key=${ post.key }
                            data-key-initial-value="${ row[post.key] }"` : "" }
                        ${ (id) ? `data-id="${id}"` : "" } ${ (post.view) ? `data-view=${post.view}` : "" }
                        data-payload="${ encodeURI(JSON.stringify(post.payload)) }"
                    >
                </div>`)
    }
    html.push(
        `    </div>
        </form>
    </div>`
    )

    return html.join("\n")
}
