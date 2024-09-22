const getDeltaRows = (context, entity, view, searchParams) => {		

    // Execute the ajax request
    const xhttp = new XMLHttpRequest()
    let route = `/bo/delta/${entity}?view=${view}`

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

    const order = $("#listOrderHidden").val()
    if (order) route += "&order=" + order

    const limit = $("#listLimitHidden").val()
    if (limit) route += "&limit=" + limit

    xhttp.open("GET", route, true)
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4) {
            if (xhttp.status == 401) getLogin(loadPage)
            else if (xhttp.status == 200) {

                if (xhttp.statusText.substring(0, 3) == "jwt") {
                    document.cookie = `JWT-${$("#instanceCaption").val()}${xhttp.statusText.substring(4)};path=/`
                }

                const data = JSON.parse(xhttp.responseText)

                $("#chartContainer2").html(renderDelta({ context, entity, view }, data))
                $("#chart2").each(function () { chart2Callback({ context, entity, view }, data) })
            }
            else toastr.error("A technical error has occured. PLease try again later")
        }
    }
    xhttp.send()
}
