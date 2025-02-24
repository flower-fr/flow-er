
const triggerDetail = ({ context, entity, view }, searchParams) => {

    $(".fl-list-detail").click(function () {
        const id = $(this).attr("data-id")
        const route = ($(this).attr("data-fl-controller")) ? `/${ $(this).attr("data-fl-controller") }/${ $(this).attr("data-fl-action") }/${ $(this).attr("data-fl-entity") }/${ $(this).attr("data-id") }` : `${$("#detailRoute").val()}/${id}?view=${view}`
        $(this).removeClass("btn-outline-primary").addClass("btn-primary")
        $("#flListDetailModal").html("")
        getDetail(context, entity, view, route, id, searchParams)
    })
}

const getDetail = async (context, entity, view, route, id, searchParams) => {

    //const route = `${$("#detailRoute").val()}/${id}?view=${view}`

    const response = await fetch(route)
    if (!response.ok) {
        switch (response.status) {
        case 401:
            document.location("user/login")
            return
        case 500:
            toastr.error("A technical error has occured. PLease try again later")
            return
        }
    }

    const data = await response.json()

    if (id != 0) {
        const n_fn = $("#detailCaption-" + id).val()
        $("#flListDetailModalLabel").text(n_fn)
    }
    else $("#flListDetailModalLabel").text(context.translate("Add"))

    $("#flListDetailModal").html(renderDetail({ context, entity, view}, data))

    $(".detailTab").click(function () {
        const tabId = $(this).attr("id").split("-")[1]
        $(".detailTab").removeClass("active")
        $(this).addClass("active")
        const route = $(`#detailTabRoute-${tabId}`).val()
        getTab({ context, entity, view }, tabId, route, id, "", searchParams)
    })

    const tab = $("#defaultTab").val(), tabRoute = $(`#detailTabRoute-${tab}`).val()
    getTab({ context, entity, view }, tab, tabRoute, id, "", searchParams)
}
