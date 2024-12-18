
const getGlobal = async ({context, entity, view }, route, message = null) => {

    const searchParams = getSearchParams()
    
    const columns = $("#columns").val()
    if (columns) route += "columns=" + columns

    const where = searchParams.join("|")
    if (where) route += "&where=" + where

    const order = $("#listOrderHidden").val()
    if (order) route += "&order=" + order

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
    const renderer = (data.layout.renderer) ? { "renderGlobal": renderGlobal}[data.layout.renderer] : renderGlobal
    
    if (data.layout.title) $("#flGlobalModalLabel").text(context.localize(data.layout.title))

    $("#flGlobalModal").html(renderer({ context, entity, view }, data))

    $(".globalMessage").hide()
    if (message == "ok") {
        $("#globalMessageOk").show()
        document.location = "#globalMessageOk"
    }
    else if (message == "expired") {
        $("#globalMessageExpired").show()
        document.location = "#globalMessageExpired"
    }
    else if (message == "consistency") {
        $("#globalMessageConsistency").show()
        document.location = "#globalMessageConsistency"
    }
    else if (message == "duplicate") {
        $("#globalMessageDuplicate").show()
        document.location = "#globalMessageDuplicate"
    }
    else if (message == "serverError") {
        $("#globalMessageServerError").show()
        document.location = "#globalMessageServerError"
    }
    else postGlobal({ context, entity, view }, data)
}
