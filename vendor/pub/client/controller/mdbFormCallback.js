
const mdbFormCallback = () => {

    $(".csr-form-outline-input").each(function () {
        const formOutline = $(this)
        new mdb.Input(formOutline, {
            size: "sm"
        })
    })

    document.querySelectorAll('.csr-select').forEach((select) => {
        new mdb.Select(select, {
            size: "sm"
        })
    })
}
