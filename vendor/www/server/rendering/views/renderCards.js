const renderCards = (context, site) => {

    const cardConfig = context.config[`${ site }/card`], html = []

    for (const entry of cardConfig) {
        html.push(renderCard(context, entry))
    }

    for (const entry of cardConfig) {
        html.push(renderModal(context, entry))
    }
  
    return html.join("\n")
}

const renderCard = (context, entry) => {

    const html = []

    html.push(`    
        <div class="col-lg-3 mb-4 mb-lg-0 pb-2">
          <div class="card">
            <div class="bg-image">
              <img
                   src="${ context.localize(entry.image) }"
                   class="card-img-top"
                   alt="${ context.localize(entry.title) }"
                   />
            </div>
            <div class="card-body">
              <h5 class="card-title text-center my-3">${ context.localize(entry.title) }</h5>
              <hr class="my-3" />
              <a href="#!" data-mdb-ripple-init data-mdb-modal-init data-mdb-target="#${ context.localize(entry.title) }">
                Voir le profil
                <i class="fas fa-long-arrow-alt-right ms-2" aria-hidden="true"></i>
              </a>
            </div>
          </div>
        </div>`)

    return html.join("\n")
}

const renderModal = (context, entry) => {

    const html = []

    html.push(`    
        <div class="modal fade" id="${ context.localize(entry.title) }" tabindex="-1" aria-labelledby="${ context.localize(entry.title) }Label" aria-hidden="true">
            <div class="modal-dialog modal-xl">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="${ context.localize(entry.title) }Label">${ context.localize(entry.title) }</h5>
                        <button type="button" class="btn-close" data-mdb-ripple-init data-mdb-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <section>
                            <div class="row">
                                <div class="col-12">
                                    <div class="tab-content pt-3" id="servicesContent">
                                        <div
                                            class="tab-pane fade show active"
                                            role="tabpanel"
                                            >
                                            <div class="row">
                                                <div class="col-lg-6 mb-4 mb-lg-0 pb-2 pb-lg-0 pb-xl-2">
                                                    <img
                                                        src="${ context.localize(entry.image) }"
                                                        class="img-fluid shadow-2-strong rounded"
                                                        alt="${ context.localize(entry.title) }"
                                                    />
                                                </div>
                                                <div class="lead col-lg-6">`)

    for (const paragraph of entry.text) {

        html.push(`
                                                    <p class="mb-3">
                                                        ${ context.localize(paragraph) }
                                                    </p>`)
    }

    html.push(`    
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>`)

    return html.join("\n")
}

module.exports = {
    renderCards
}