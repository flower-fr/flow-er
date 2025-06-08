
const getGroupTab = async ({ context, entity, view }, tab, searchParams) => {

    let route = $(`#detailTabRoute-${tab}`).val()
    const routeDef = $(`#detailTabRoute-${tab}`), tabController = routeDef.attr("data-controller"), tabAction = routeDef.attr("data-action"), tabEntity = routeDef.attr("data-entity"), tabId = routeDef.attr("data-id"), tabQuery = routeDef.attr("data-query")
    route = `/${tabController}/${tabAction}/${tabEntity}?${ (tabQuery) ? tabQuery : "" }`

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

    const rows = []
    $(".fl-list-check").each(function () {
        if ($(this).prop("checked")) {
            const checkData = $(this).attr("data-properties").split("|")
            const row = {}
            for (let pair of checkData) {
                pair = pair.split(":")
                row[pair[0]] = decodeURIComponent(pair[1])
            }
            rows.push({ ...row })
        }
    })

    $(".renderUpdate").each(function () { 
        const tabId = $(this).attr("id").split("-")[1]
        if (tabId == tab) {
            $("#detailPanel").html(renderGroupTabCards({ context, entity, view }, data, rows))
            updateCallback({ context, entity, view }, data)
        }
    })
    $(".renderModalList").each(function () {
        const tabId = $(this).attr("id").split("-")[1]
        if (tabId == tab) {
            $("#detailPanel").html(renderModalList({ context, entity, view }, data)) 
            modalListCallback({ context, entity, view }, data)
            triggerModalList({ context, entity, view }, data, tab, route, 0, false, searchParams)
        }
    })
    $(".renderModalCalendar").each(function () {
        const tabId = $(this).attr("id").split("-")[1]
        if (tabId == tab) {
            $("#detailPanel").html(renderModalCalendar({ context, entity, view }, tabId, data)) 
            modalCalendarCallback({ context, entity, view }, tabId, data)
        }
    })

    $(".form-change").each(function () {
        const propertyId = $(this).attr("data-property-id")
        $(`#${propertyId}`).change(function () {
            const value = $(this).val()
            searchParams[propertyId] = value
            getGroupTab({ context, entity, view }, tab, searchParams )
        })
    })

    $(".fl-group-tab-message").hide()

    $(".fl-update-button").each(() => {
        $(".fl-submit-div").hide()
        $(".fl-close-button").hide()
    })

    $(".fl-update-button").click(function() {
        $(".fl-submit-div").show()
        $(".fl-close-button").show()
        $(".fl-update-button").hide()
    })

    $(".fl-close-button").click(() => {
        $(".fl-submit-div").hide()
        $(".fl-close-button").hide()
        $(".fl-update-button").show()
        $(".fl-group-tab-message").hide()
    })

    triggerSmsText()

    postGroupTab({ context, entity, view }, tab, searchParams)
}
