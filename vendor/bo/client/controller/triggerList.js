const triggerList = async ({ context, entity, view }, searchParams) => {		

    // Route with params

    let route = `${$("#searchRoute").val()}`

    const columns = $("#columns").val()
    if (columns) route += "columns=" + columns

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

    // Fetch

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
    $("#dataview").html(searchRenderer({ context, entity, view }, data))
    searchCallback({ context, entity, view })

    getListRows(context, entity, view, getSearchParams())
    $("#chartContainer2").each(() => { getDeltaRows(context, entity, view, getSearchParams()) })

    // Trigger search request

    triggerSearch({ context, entity, view })

    $(".searchSelectTagsIds").each(function () {
        const propertyId = $(this).attr("id").split("-")[1]
        const tagId = $(this).attr("id").split("-")[2]
        const name = $(`#searchSelectTagsName-${propertyId}-${tagId}`).val()
        const ids = $(this).val().split(",")
        for (const id of ids) {
            const td = $(`#listTagsName-${propertyId}-${id}`)
            if (td) {
                let label = (td.html()) ? td.html().split(",") : []
                label.push(name)
                $(`#listTagsName-${propertyId}-${id}`).html(label.join(","))
            }
        }
    })

    // Trigger order request
    
    triggerOrder(context, entity, view)

    // Extend the displayed list

    $(".listMoreButton").click(function () {
        $("#listLimitHidden").val("")
        triggerList(context, entity, view, getSearchParams())
    })

    // Enable group action

    $("#listGroupButton-0").hide()
    $("#listGroupButton-1").prop("disabled", true)
    $("#listGroupTr").hide()

    // Trigger checking rows for group action

    $(".listCheck").click(function (e) {
        if (e.shiftKey) {
            const max = $(this).attr("id").split("-")[2], state = $(this).prop("checked")
            let min = 0
            $(".listCheck").each(function () {
                const i = parseInt($(this).attr("id").split("-")[2])
                if ($(this).prop("checked") && i < max) min = i
            })
            $(".listCheck").each(function () {
                const i = parseInt($(this).attr("id").split("-")[2])
                if (i >= min && i <= max) $(this).prop("checked", state)
            })
        } 
        else {
            const id = parseInt($(this).attr("id").split("-")[1])
        }

        let count = 0, checked = 0, sum = 0, sumChecked = 0
        $(".listCheck").each(function () {
            count++
            const id = parseInt($(this).attr("id").split("-")[1]), amount = parseFloat($(`#listAmount-${id}`).val())
            if (amount) sum += amount
            if ($(this).prop("checked")) {
                checked++
                sumChecked += amount
            } 
        })
        if (checked > 0) {
            $(".listGroupButton").show()
            $("#listGroupButton-1").prop("disabled", false)
            $("#listDetailButton-0").hide()
            $("#listGroupTr").show()
            $("#listCount").text(checked)
            if (sumChecked) $("#listSum").text((Math.round(sumChecked * 100) / 100).toFixed(2))
        }
        else {
            $("#listGroupButton-0").hide()
            $("#listGroupButton-1").prop("disabled", true)
            $("#listDetailButton-0").show()
            $("#listGroupTr").hide()
            $("#listCount").text(count)
            if (sum) $("#listSum").text((Math.round(sum * 100) / 100).toFixed(2))
        }
    })

    // Trigger checking all

    $(".listCheckAll").click(function () {
        const state = $(this).prop("checked")
        $(".listCheck").prop("checked", state)
        $(".listCheckAll").prop("checked", state)

        if (state) {
            $("#listGroupButton-0").show()
            $("#listGroupButton-1").prop("disabled", false)
            $("#listDetailButton-0").hide()
        }
        else {
            $("#listGroupButton-0").hide()
            $("#listGroupButton-1").prop("disabled", true)
            $("#listDetailButton-0").show()
        }

        let count = 0, sum = 0
        $(".listCheck").each(function () {
            count++
            const id = parseInt($(this).attr("id").split("-")[1]), amount = parseFloat($(`#listAmount-${id}`).val())
            if (amount) sum += amount
        })
        $("#listCount").text(count)
        if (sum) $("#listSum").text((Math.round(sum * 100) / 100).toFixed(2))
    })

    // Widgets
    
    $(".datepicker").datepicker()
    $(".timepicker").timepicker({ "timeFormat":"H:i:s", "step": 15, "scrollDefault": "now" })

    // Connect the grouped actions anchors
    $(".listGroupButton").click(function () {
        getGroup()
    });
}
