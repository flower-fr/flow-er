import { getSearchParams } from "/flBo/cli/controller/getSearchParams.js"

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

    $(".fl-global-message").hide()
    if (message == "ok") {
        $("#flGlobalMessageOk").show()
        document.location = "#flGlobalMessageOk"
    }
    else if (message == "expired") {
        $("#flGlobalMessageExpired").show()
        document.location = "#flGlobalMessageExpired"
    }
    else if (message == "consistency") {
        $("#flGlobalMessageConsistency").show()
        document.location = "#flGlobalMessageConsistency"
    }
    else if (message == "duplicate") {
        $("#flGlobalMessageDuplicate").show()
        document.location = "#flGlobalMessageDuplicate"
    }
    else if (message == "serverError") {
        $("#flGlobalMessageServerError").show()
        document.location = "#flGlobalMessageServerError"
    }
    else postGlobal({ context, entity, view }, data)
}

export { getGlobal }