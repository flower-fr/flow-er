
const { renderCore } = require("./renderCore")

const renderScripts = ({ context, entity, view }, data) => {

    const indexConfig = data.indexConfig

    return `<!-- Scripts -->
    <script src="/flBo/cli/resources/jquery/jquery-3.6.3.min.js" ></script>
    <script src="/flBo/cli/resources/popper/popper.min.js"></script>
    <script src="/flBo/cli/resources/bootstrap-5.3.3-dist/js/bootstrap.bundle.min.js"></script>
    <script src="/flBo/cli/resources/jquery-ui-1.13.2/jquery-ui.js"></script>
    <script src="/flBo/cli/resources/jquery.timepicker/jquery.timepicker.js"></script>
    <script src="/flBo/cli/resources/toastr/build/toastr.min.js"></script>
    <script src="/flBo/cli/resources/json-viewer/jquery.json-viewer.js"></script>

    <script>
    $.datepicker.regional['fr'] = {
        prevText: "${context.translate("Previous")}",
        nextText: "${context.translate("Next")}",
        monthNames: [
            "${context.translate("January")}",
            "${context.translate("February")}",
            "${context.translate("March")}",
            "${context.translate("April")}",
            "${context.translate("May")}",
            "${context.translate("June")}",
            "${context.translate("July")}",
            "${context.translate("August")}",
            "${context.translate("September")}",
            "${context.translate("October")}",
            "${context.translate("November")}",
            "${context.translate("December")}"
        ],
        dayNamesMin: [
            "${context.translate("Su")}",
            "${context.translate("Mo")}",
            "${context.translate("Tu")}",
            "${context.translate("We")}",
            "${context.translate("Th")}",
            "${context.translate("Fr")}",
            "${context.translate("Sa")}"
        ],
        dateFormat: "dd/mm/yy",
        firstDay: 1,
        isRTL: false,
        yearSuffix: ""
    }
    
    ${(data.user.locale.substring(0, 2) == "fr") ? "$.datepicker.setDefaults($.datepicker.regional[\"fr\"])" : ""}
    </script>

    <!-- FullCalendar -->
    <script src="/flBo/cli/resources/moment/moment-with-locales.min.js"></script>
    <script src="/flBo/cli/resources/fullcalendar-6.1.15/dist/index.global.min.js"></script>

    <!-- ZingChart -->
    <script src="/flBo/cli/resources/zingchart/zingchart.min.js"></script>
                
    <!-- Flow-ER -->
    ${ renderCore({ context, entity, view }, data) }`
}

module.exports = {
    renderScripts
}
