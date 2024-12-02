const renderDetailTab = ({ context, entity }, { data, detailTabConfig, formJwt }) => {

    const renderers = { renderModalList: renderModalList, renderUpdate: renderUpdate }

    const layout = detailTabConfig.layout

    const html = []

    html.push(
        `<div class="my-3 mt-5">

            <input type="hidden" id="formJwt" name="formJwt" value="${ formJwt }" />

            <!-- Form status messages -->

            <!-- <div class="updateMessage" id="updateMessageOk">
                <h5 class="alert alert-success my-3 text-center">${context.translate("Your request has been registered")}</h5>
            </div>

            <div class="updateMessage" id="updateMessageExpired">
                <h5 class="alert alert-danger my-3 text-center">${context.translate("The form has expired, please input again")}</h5>
            </div>

            <div class="updateMessage" id="updateMessageConsistency">
                <h5 class="alert alert-danger  my-3 text-center">${context.translate("The database has evolved in the meantime, please input again")}</h5>
            </div>

            <div class="updateMessage" id="updateMessageDuplicate">
                <h5 class="alert alert-danger  my-3 text-center">${context.translate("The data already exists")}</h5>
            </div>

            <div class="updateMessage" id="updateMessageServerError">
                <h5 class="alert alert-danger  my-3 text-center">${context.translate("A technical error has occured. PLease try again later")}</h5>
            </div> -->
            
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

                            style="position: relative; height: 600px; overflow: auto;"
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
        if (sectionData && condition) {
            const properties = sectionData.properties, rows = sectionData.rows
            html.push(
                `<section id="${sectionId}">
                    ${ (section.labels) ? `<h5 class="my-4">${context.localize(section.labels)}</h5>`: "" }
                    <div class="row">
                        ${ (section.renderer == "renderUpdate") ?
        (renderers[section.renderer])({ context, entity }, section, properties, rows[0]) :
        (renderers[section.renderer])({ context, entity }, { section, config: detailTabConfig, properties, rows }) }
                    </div>
                </section>`
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

    html.push("<div class=\"form-group row my-4 submitDiv\">")

    for (let postId of Object.keys(layout.posts)) {
        const post = layout.posts[postId]
        html.push(
            `   <div>
                    <input name="submit-${postId}" type="submit" id="submitButton-${postId}" class="btn btn-warning submitButton mt-3" value="${ context.localize(post.labels) }" data-controller=${post.controller} data-action=${post.action} data-entity=${post.entity} data-transaction=${postId} ${ (post.view) ? `data-view=${post.view}` : "" }>
                </div>`)
    }
    html.push(
        `    </div>
        </form>
    </div>`
    )

    return html.join("\n")
}
