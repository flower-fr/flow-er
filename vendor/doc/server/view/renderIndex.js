const { renderSidenav } = require("./renderSidenav")
const { renderContent } = require("./renderContent")

const renderIndex = ({ context, entity, view }, data) => {

    const docConfig = context.config[`${entity}/doc/${view}`]

    return `<!DOCTYPE html>
<html lang="en" data-mdb-theme="dark">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <meta http-equiv="x-ua-compatible" content="ie=edge" />
        <title>Material Design for Bootstrap</title>
        
        <!-- Google Fonts Roboto -->
        <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap"
        />
        <!-- MDB ESSENTIAL -->
        <link rel="stylesheet" href="/mdb/cli/resources/mdb/css/mdb.min.css" />
        <!-- MDB PLUGINS -->
        <link rel="stylesheet" href="/mdb/cli/resources/mdb/plugins/css/all.min.css" />
        <!-- Font Awesome -->
        <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
        />
        <!-- Custom styles -->
    </head>

    <body>
    
        ${ renderSidenav({ context, entity, view}, context.config[`${entity}/doc/sidenav`]) }

        <div id="content">

            <div class="container mb-5 mt-5">
                <!-- Toggler -->
                <button
                    data-mdb-ripple-init
                    data-mdb-toggle="sidenav"
                    data-mdb-target="#sidenav"
                    class="btn btn-primary"
                    aria-controls="#sidenav"
                    aria-haspopup="true"
                >
                    <i class="fas fa-bars"></i>
                </button>
                <!-- Toggler -->
            </div>

            <div class="container">

                ${ renderContent({ context, entity, view }, docConfig) }

            </div>
        </div>
    </body>

    <script src="/bo/cli/resources/jquery/jquery-3.6.3.min.js" ></script>
    <script src="/bo/cli/resources/moment/moment-with-locales.min.js"></script>

    <script src="/mdb/cli/mdbootstrap/renderColumns.js"></script>
    <script src="/mdb/cli/mdbootstrap/renderSearch.js"></script>
    <script src="/mdb/cli/mdbootstrap/renderCalendar.js"></script>
    <script src="/mdb/cli/mdbootstrap/renderDetail.js"></script>
    <script src="/mdb/cli/mdbootstrap/renderUpdate.js"></script>
    <script src="/mdb/cli/mdbootstrap/renderModalList.js"></script>
    <script src="/bo/cli/bootstrap/renderLayout.js"></script>
    <script src="/doc/cli/controller/index.js"></script>

    <script src="/bo/cli/controller/triggerList.js"></script>

    <script src="/mdb/cli/controller/mdbSearchCallback.js"></script>
    <script src="/mdb/cli/controller/mdbListCallback.js"></script>
    <script src="/mdb/cli/controller/mdbCalendarCallback.js"></script>
    <script src="/mdb/cli/controller/mdbUpdateCallback.js"></script>
    <script src="/mdb/cli/controller/mdbModalListCallback.js"></script>

    <!-- MDB ESSENTIAL -->
    <script type="text/javascript" src="/mdb/cli/resources/mdb/js/mdb.umd.min.js"></script>
    <!-- MDB PLUGINS -->
    <script type="text/javascript" src="/mdb/cli/resources/mdb/plugins/js/all.min.js"></script>
    <!-- Custom scripts -->
    <script type="text/javascript">
        let sideNav = document.getElementById('sidenav-6');
        sideNav.style.width = '280px';

        searchCallback = mdbSearchCallback
        calendarCallback = mdbCalendarCallback
        updateCallback = mdbUpdateCallback
        loadPage({ entity: "${entity}", view: "${view}" })
        </script>
</html>`
}

module.exports = {
    renderIndex
}
