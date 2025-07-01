const { renderHead } = require("./views/renderHead")

const render404 = (context) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
        ${ renderHead(context) }

        <body>
            <header>
            </header>

            <main>
                <div class="container my-5">
    
                <div class="row">
                    <!-- Grid column -->
                    <div class="col-12">
                        <!--Section: Block Content-->
                        <section class="my-5 text-center">
                            <h1 class="display-1">404</h1>

                            <h4 class="mb-4">${ context.translate("Page not found") }</h4>

                            <p class="mb-4">
                                ${ context.translate("The Page you are looking for doesn't exist or an other error occurred.") }
                            </p>
                            <a class="btn btn-primary" href="/" role="button" data-mdb-ripple-init>${ context.translate("Go back to the homepage") }</a>
                        </section>
                        <!--Section: Block Content-->
                    </div>
                    <!-- Grid column -->
                </div>

                </div>
            </main>

            <!-- MDB ESSENTIAL -->
            <script type="text/javascript" src="/js/mdb.umd.min.js"></script>
            <!-- MDB PLUGINS -->
            <script type="text/javascript" src="/plugins/js/all.min.js"></script>
            <!-- Custom scripts -->
            <script type="text/javascript" src="/js/script.js"></script>
        </body>
    </html>`
}

module.exports = {
    render404
}
