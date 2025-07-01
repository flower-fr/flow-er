const { renderHead } = require("./views/renderHead")

const { triggerPost } = require("./triggers/triggerPost")

const renderIndex = (context, config) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
        ${ renderHead(config.recaptchaToken) }

        <body>
            <header>
            </header>

<main>
  <div class="container my-5">

    <!--Section: Design Block-->
    <section class="text-center" id="contact">
      <h3 class="mb-5" style="color: #112f6b;">Contactez nous</h3>

      <form method="post" id="contactForm">
        <div class="row">
          <div class="col-md-9">
            <div class="row mb-4">
              <div class="col-md-4 mb-4 mb-md-0">
                <div class="form-outline" data-mdb-input-init>
                    <input type="text" class="form-control" id="n_first" name="n_first" required />
                    <label class="form-label" for="n_first">Nom</label>
                </div>
              </div>
              <div class="col-md-4">
                <div class="form-outline" data-mdb-input-init>
                    <input type="email" class="form-control" id="email" name="email" required />
                    <label class="form-label" for="email">Email</label>
                </div>
              </div>
              <div class="col-md-4">
                <div class="form-outline" data-mdb-input-init>
                    <input type="text" class="form-control" id="tel_cell" name="tel_cell" />
                    <label class="form-label" for="tel_cell">Téléphone</label>
                </div>
              </div>
            </div>
            <div class="form-outline mb-4" data-mdb-input-init>
                <textarea class="form-control" rows="4" id="description" name="description"></textarea>
                <label class="form-label" for="description">Message</label>
            </div>
            <div class="form-check d-flex justify-content-center mb-4">
                <input class="form-check-input me-2" type="checkbox" value="" id="form4Example4" name="opt_in_out" value="1" required />
                <label class="form-check-label" for="form4Example4">
                * En cochant cette case, j’accepte d’être contacté(e) par mail
                </label>
            </div>
            <div class="alert alert-success" id="message"></div>
            <div class="text-center text-md-start">
              <button
                  type="submit" 
                  class="btn btn-danger btn-rounded btn-lg mb-lg-5" 
                  id="contactFormButton"
                  data-mdb-ripple-init
              >
                Envoyer
              </button>
            </div>
          </div>
          <div class="col-md-3">
            <h5 class="text-uppercase mb-4 pb-1"></h5>
            <ul class="fa-ul" style="margin-left: 1.65em;">
              <li class="mb-3">
                  <b><span class="ms-2">DOUBLE CREAM SAS</span></b>
              </li>
              <li class="mb-3">
                  <span class="ms-2">RCS PARIS 942 303 579</span>
              </li>
            </ul>
          </div>
        </div>
      </form>
    </section>
    <!--Section: Design Block-->
  </div>
</main>

            <script type="text/javascript" src="/js/jquery/jquery-3.6.3.min.js" ></script>

            <!-- MDB ESSENTIAL -->
            <script type="text/javascript" src="/mdb/cli/resources/mdb/js/mdb.umd.min.js"></script>
            <!-- MDB PLUGINS -->
            <script type="text/javascript" src="/mdb/cli/resources/mdb/plugins/js/all.min.js"></script>

            <!-- Custom scripts -->
            <script type="text/javascript" src="/js/script.js"></script>
            <!-- Medium editor -->
            <script src="/js/medium-editor.js"></script>

            <script>
            ${ triggerPost(config.recaptchaToken) }
            var editor = new MediumEditor('.editable')
            editor.subscribe('editableInput', function (event, editable) {
                console.log(editable.getHTML())
            })
            </script>
        </body>
    </html>`
}

module.exports = {
    renderIndex
}
