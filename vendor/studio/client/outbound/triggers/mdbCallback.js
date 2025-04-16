const mdbCreate = () => 
{
    document.querySelectorAll(".form-outline").forEach((formOutline) => {
        new mdb.Input(formOutline, {
            showcounter: true
        })
    })

    document.querySelectorAll(".form-select").forEach((formOutline) => {

        new mdb.Select(formOutline, {
            size: "sm",
            container: "#flModalListSearchHead"
        })
    })

    $(".fl-form-date").each(function () {
        const formOutline = $(this)
        new mdb.Input(formOutline)
        new mdb.Datepicker(formOutline, { 
            datepicker: { 
                format: "dd/mm/yyyy"
            },
            monthsFull: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"],
            weekdaysNarrow: ["D", "L", "M", "M", "J", "V", "S"]
        })
    })

    document.querySelectorAll(".fl-form-time").forEach((outline) => {
        new mdb.Timepicker(outline, {
            cancelLabel: context.translate("Cancel"),
            clearLabel: context.translate("Clear"),
        })
    })
}

const mdbInitSelect = (widget, value) => 
{
    const select = mdb.Select.getInstance(widget)
    select.setValue((value) ? value.split(",") : [])
}

const mdbDispose = () => 
{
    document.querySelectorAll(".form-select").forEach((formOutline) => {
        mdb.Select.getInstance(formOutline).dispose()
    })
}

export { mdbCreate, mdbInitSelect, mdbDispose }