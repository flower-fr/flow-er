import { getSearchParams } from "/flBo/cli/controller/getSearchParams.js"

import { List } from "/bo/cli/view/list/List.js"
import { Tasks } from "/bo/cli/view/tasks/Tasks.js"

const triggerList = async ({ context, entity, view }, order = $("#flListOrderHidden").val()) => {		

    // Route with params

    let route = getListRoute()

    //const params = getSearchParams()
    let params = []
    for (let [key, value] of Object.entries(getSearchParams())) {
        if (Array.isArray(value)) {
            if (value[0] == null) value = `<=,${value[1]}`
            else if (value[1] == null) value = `>=,${value[0]}`
            else value = `between,${value[0]},${value[1]}`
        }
        params.push(key + ":" + value)
    }

    const where = params.join("|")
    if (where) route += `&where=${where}`

    if (order) route += `&order=${order}`

    let limit = $("#flListLimitHidden").val()
    if (limit) route += `&limit=${ parseInt(limit) }`

    // Fetch

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
    
    const list = (view === "task") ? new Tasks({ context, entity, view, data }) : new List({ context, entity, view, data })
    $("#flList").html(list.render())
    list.trigger()
}

export { triggerList }