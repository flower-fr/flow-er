import { getGroupTab } from "/flBo/cli/controller/getGroupTab.js"

const triggerGroup = ({ context, entity, view }, searchParams) => {

    $(".fl-list-group").click(function () {
        const route = `/${ $(this).attr("data-fl-controller") }/${ $(this).attr("data-fl-action") }/${ entity }${ (view) ? `?view=${view}` : "" }`
        $(this).removeClass("btn-outline-primary").addClass("btn-primary")
        getGroup({ context, entity, view }, route,  searchParams)
    })
}

const getGroup = async ({ context, entity, view }, route, searchParams) => {

    const response = await fetch(route)
    if (!response.ok) {
        switch (response.status) {
        case 401:
            getLogin(loadPage)
            return
        case 500:
            toastr.error("A technical error has occured. PLease try again later")
            return
        }
    }
    
    const data = await response.json()

    $("#flListDetailModalLabel").text(context.translate("Grouped actions"))
    $("#flListDetailModal").html(renderGroup({ context, entity, view}, data))

    $(".fl-group-tab").click(function () {
        const tabId = $(this).attr("id").split("-")[1]
        $(".fl-group-tab").removeClass("active")
        $(this).addClass("active")
        getGroupTab({ context, entity, view }, tabId, searchParams)
    })

    getGroupTab({ context, entity, view }, $("#flDefaultTab").val(), searchParams)
}

export { triggerGroup }