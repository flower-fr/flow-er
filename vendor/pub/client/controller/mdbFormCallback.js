
const mdbFormCallback = () => {

    $(".csr-form-outline-input").each(function () {
        const formOutline = $(this)
        new mdb.Input(formOutline, {
            size: "sm"
        })
    })

    document.querySelectorAll(".csr-select").forEach((select) => {
        new mdb.Select(select, {
            size: "sm"
        })
    })

    document.querySelectorAll(".dateOutline").forEach((formOutline) => {
        new mdb.Input(formOutline)
        new mdb.Datepicker(formOutline, { 
            format: "yyyy-mm-dd",
            monthsFull: [ "Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre" ],
            monthsShort: ["Jan", "Fév", "Mars", "Avr", "Mai", "Juin", "Juil", "Août", "Sept", "Oct", "Nov", "Déc"],
            weekdaysNarrow: ["D", "L", "M", "M", "J", "V", "S"],
            startDay: 1,
            startDate: (formOutline.getAttribute("startDate")) ? formOutline.getAttribute("startDate") : moment().format("YYYY-MM-DD"),
            inline: true
        })
    })
}
