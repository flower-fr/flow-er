const renderDocument = ({ context }, { data, config }) => {

    console.log("in renderDocument (flBo)")

    const layout = config.layout

    const html = []

    html.push(
        `<div class="my-3 mt-5">

            <div class="row">`
    )

    if (layout.cols) {
        html.push(
            `       <div class="${ layout.cols.content.class || "col-md-8" }">
                        <div
                            id="flModalScrollspyDiv"
                            data-mdb-scrollspy-init
                            data-mdb-target="#flModalScrollspy"

                            style="position: relative; height: 600px; overflow: auto;"
                        >
                            <div class="row">`
        )
    }
    
    html.push(
        `<div class="card">
            <div class="card-body">
                 <div class="row">`)

    for (const [sectionId, section] of Object.entries(layout.sections)) {

        /**
         * Display of section is conditionned to given parameter vs config rule
         */

        const sectionData = data[section.entity]

        html.push(renderDocumentSection({ context }, { config: section, properties: data.properties, rows: sectionData.rows }))
    }

    html.push(
        `       </div>
            </div>
        </div>`
    )

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
                        </div>
                        <!-- Scrollspy -->
                    </div>
                    <!-- col -->
                </div>
                <!-- row -->`
        )
    }

    html.push("</div>")

    return html.join("\n")
}
