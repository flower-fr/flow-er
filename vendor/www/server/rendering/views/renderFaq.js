const renderFaq = (context, site) => 
{
    const faqConfig = context.config[`${ site }/faq`], html = []

    html.push(`
  <section class="mb-10">
    <h2 class="fw-bold mb-5 text-center">Questions fréquemment posées</h2>

    <div class="row">`)

    for (const faqEntry of faqConfig) {
        html.push(`
        <div class="col-lg-4 col-md-12 mb-5">
          <p class="fw-bold">${ context.localize(faqEntry.question) }</p>
          <p class="text-muted">
          ${ context.localize(faqEntry.answer) }
          </p>
        </div>`)  
    }

    html.push(`
    </div>
  </section>`)

    return(html.join("\n"))
}

module.exports = {
    renderFaq
}