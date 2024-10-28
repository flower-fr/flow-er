
const getGroupTab = async ({ context, entity, view }, tab, searchParams) => {

    let route = $(`#detailTabRoute-${tab}`).val()

    let params = []
    for (const key of Object.keys(searchParams)) {
        let value = searchParams[key]
        if (Array.isArray(value)) {
            if (value[0] == null) value = `le,${value[1]}`
            else if (value[1] == null) value = `ge,${value[0]}`
            else value = `between,${value[0]},${value[1]}`
        }
        params.push(key + ":" + value)
    }
    const where = params.join("|")
    if (where) route += "&where=" + where

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

    $(".renderUpdate").each(function () { 
        const tabId = $(this).attr("id").split("-")[1]
        if (tabId == tab) {
            $("#detailPanel").html(renderGroupTabCards({ context, entity, view }, data))
            updateCallback({ context, entity, view }, data)
        }
    })
    $(".renderModalList").each(function () {
        const tabId = $(this).attr("id").split("-")[1]
        if (tabId == tab) {
            $("#detailPanel").html(renderModalList({ context, entity, view }, data)) 
            modalListCallback({ context, entity, view }, data)
            triggerModalList({ context, entity, view }, data)
        }
    })
    $(".renderModalCalendar").each(function () {
        const tabId = $(this).attr("id").split("-")[1]
        if (tabId == tab) {
            $("#detailPanel").html(renderModalCalendar({ context, entity, view }, tabId, data)) 
            modalCalendarCallback({ context, entity, view }, tabId, data)
        }
    })

    postGroupTab({ context, entity, view }, tab, searchParams)
}
