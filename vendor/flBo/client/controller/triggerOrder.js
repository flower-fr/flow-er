import { triggerList } from "/flBo/cli/controller/triggerList.js"

const triggerOrder = ({ context, entity, view }) => {

    $(".fl-list-order-button").click(function() {
        const propertyId = $(this).attr("data-fl-property")
        let direction = $(this).attr("data-fl-direction")
        if (!direction || direction == "-") direction = ""
        else direction = "-"
        triggerList({ context, entity, view }, `${direction}${propertyId}`)
    })    
}

export { triggerOrder }