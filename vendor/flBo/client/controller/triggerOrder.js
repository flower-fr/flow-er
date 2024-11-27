const triggerOrder = ({ context, entity, view }) => {

    $(".fl-order-asc").hide()
    $(".fl-order-desc").hide()

    $(".fl-order").click(function () {

        const propertyId = $(this).attr("data-property-id"), direction = $(this).attr("data-direction")
        $(".fl-order").attr("data-direction", "")
        if (direction == "1") {
            $(this).attr("data-direction", "desc")
            $(`#flOrderDesc-${ propertyId }`).show()
        }
        else {
            $(this).attr("data-direction", "asc")
            $(`#flOrderAsc-${ propertyId }`).show()
        }

        triggerList({ context, entity, view })    
    })
}
