const renderScripts = ({ context }, data) => {

    return `
    <script src="/flBo/cli/resources/jquery/jquery-3.6.3.min.js" ></script>
    <script src="/flBo/cli/resources/jquery-ui-1.13.2/jquery-ui.js"></script>
    <script src="/flBo/cli/resources/jquery.timepicker/jquery.timepicker.js"></script>
    <script src="/flBo/cli/resources/toastr/build/toastr.min.js"></script>
    <script src="/flBo/cli/resources/moment/moment-with-locales.min.js"></script>

    <!-- MDB ESSENTIAL -->
    <script type="text/javascript" src="/mdb/cli/resources/mdb/js/mdb.umd.min.js"></script>
    <!-- MDB PLUGINS -->
    <script type="text/javascript" src="/mdb/cli/resources/mdb/plugins/js/all.min.js"></script>

    <script type="text/javascript" src="/user/cli/controller/passwordVisibility.js"></script>`
}

module.exports = {
    renderScripts
}
