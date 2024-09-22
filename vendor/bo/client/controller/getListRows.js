const getListRows = (context, entity, view, searchParams) => {		

    // Execute the ajax request
    const xhttp = new XMLHttpRequest()
    let route = $("#listRoute").val()

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
                $("#listParent").html(listRenderer({ context, entity, view }, data))
                listCallback({ context, entity, view })

                $("#chart1").html(renderChart({ context, entity, view }, data))
                $("#chart").each(function () { chartCallback({ context, entity, view }, data) })

                $("#calendar").each(function () { calendarCallback({ context, entity, view }, data) })

                $("#listGroupButton-0").hide()
                $("#listGroupButton-1").prop("disabled", true)
                $("#listGroupTr").hide()

                // Connect the more anchor
                $(".listMoreButton").click(function () {
                    $("#listLimitHidden").val("")
                    getListRows(context, entity, view, getSearchParams())
                })

                // Able the group action button

                const manageInputs = () => {
                    let selected = false
                    $(".listGroupCheck").each(function () {
                        if ($(this).prop("checked")) selected = true
                    })
                    if (selected) $(".listEditButton").removeClass("btn-outline-primary").addClass("btn-warning")
                    else $(".listEditButton").removeClass("btn-warning").addClass("btn-outline-primary")
                }

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

                // Connect the check all checkbox
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

                $(".listInput").change(function () {
                    let propertyId = $(this).attr("name")
                    $("#listGroupCheck-" + propertyId).prop("checked", "checked")
            
                    let selected = false
                    $(".listGroupCheck").each(function () {
                        if ($(this).prop("checked")) selected = true
                    })
                    if (selected) {
                        $(".listEditButton").prop("disabled", false)
                        $(".listEditButton").removeClass("btn-outline-primary").addClass("btn-warning")
                    } 
                    else {
                        $(".listEditButton").prop("disabled", true)
                        $(".listEditButton").removeClass("btn-warning").addClass("btn-outline-primary")
                    } 
                    manageInputs()
                })

                $(".listGroupCheck").change(function () {
                    let selected = false
                    $(".listGroupCheck").each(function () {
                        if ($(this).prop("checked")) selected = true
                    })
                    if (selected) {
                        $(".listEditButton").prop("disabled", false)
                        $(".listEditButton").removeClass("btn-outline-primary").addClass("btn-warning")
                    } 
                    else {
                        $(".listEditButton").prop("disabled", true)
                        $(".listEditButton").removeClass("btn-warning").addClass("btn-outline-primary")
                    } 
                    manageInputs()
                });

                $(".listEditButton").click(function () {
                    getListGroupUpdate()
                })

                // Connect the grouped actions anchors
                $(".listGroupButton").click(function () {
                    $("#modalBody").html("")
                    getGroup()
                });

                // Connect the detail anchors
                $(".listDetailButton").click(function () {
                    const id = $(this).attr("id").split("-")[1]
                    $(this).removeClass("btn-outline-primary").addClass("btn-primary")
                    $("#modalBody").html("")
                    getDetail(context, entity, view, id, searchParams)
                })
            }
            else toastr.error("A technical error has occured. PLease try again later")
        }
    }
    xhttp.send()
}
