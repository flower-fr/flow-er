const triggerOrder = (context, entity, view) => {

    $(".listOrderHead").hide()
    $(".flDescendingCheck").prop("disabled", true)
    triggerDirection(context, entity, view)

    $("#flOrderButton").click(function () {
        if ($(this).hasClass("btn-primary")) {
            $(".listOrderHead").hide()
            $(this).removeClass("btn-primary").addClass("btn-outline-primary")
        }
        else {
            $(".listOrderHead").show()
            $(this).removeClass("btn-outline-primary").addClass("btn-primary")
        }
    })

    $(".flOrderSelect").change(function () {
        const propertyId = $(this).val()
        if (propertyId) {
            $(".flDescendingCheck").prop("disabled", false)
            const direction = ($("#flDescendingCheck").prop("checked")) ? "-" : ""
            $("#listOrderHidden").val(direction + propertyId)
            getListRows(context, entity, view, getSearchParams())    
        }
        else {
            $("#listOrderHidden").val("")
            getListRows(context, entity, view, getSearchParams())    
            $(".flDescendingCheck").prop("disabled", true)
        }
    })
}

const triggerDirection = (context, entity, view) => {
    $(".flDescendingCheck").change(function () {
        const propertyId = $("#flOrderSelect").val()
        const direction = ($(this).prop("checked")) ? "-" : ""
        $("#listOrderHidden").val(direction + propertyId)
        getListRows(context, entity, view, getSearchParams())
    })
}