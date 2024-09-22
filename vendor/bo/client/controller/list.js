const getListGroupUpdate = () => {

    $(".listEditButton").removeClass("btn-warning").addClass("btn-danger")

    const formData = new FormData()
    formData.append("formJwt", $("#listFormJwt").val())

    let ids = []
    $(".listCheck").each(function () {
        if ($(this).prop("checked")) ids.push($(this).attr("id").split("-")[1])
    })
    formData.append("ids", ids)
  
    let xhttp = new XMLHttpRequest()

    $(".listText").each(function () {
        const propertyId = $(this).attr("name"), check = $(`#listGroupCheck-${propertyId}`).prop("checked")
        if (check == 1) formData.append(propertyId, $(this).val());
    })

    $(".listEmail").each(function () {
        const propertyId = $(this).attr("name"), check = $(`#listGroupCheck-${propertyId}`).prop("checked")
        if (check == 1) formData.append(propertyId, $(this).val())
    })
  
    $(".listPhone").each(function () {
        const propertyId = $(this).attr("name"), check = $(`#listGroupCheck-${propertyId}`).prop("checked")
        if (check == 1) formData.append(propertyId, $(this).val())
    })

    $(".listDate").each(function () {
        const propertyId = $(this).attr("name"), val = $(this).val(), check = $(`#listGroupCheck-${propertyId}`).prop("checked")
        if (check == 1) {
            if (val) formData.append(propertyId, val.substring(6, 10) + "-" + val.substring(3, 5) + "-" + val.substring(0, 2));
            else formData.append(propertyId, 0);
        }
    })

    $(".listNumber").each(function () {
        const propertyId = $(this).attr("name"), check = $(`#listGroupCheck-${propertyId}`).prop("checked")
        if (check == 1) formData.append(propertyId, $(this).val());
    })

    $(".listTime").each(function () {
        const propertyId = $(this).attr("name"), check = $(`#listGroupCheck-${propertyId}`).prop("checked")
        if (check == 1) formData.append(propertyId, $(this).val());
    })
  
    $(".listSelect").each(function () {
        const propertyId = $(this).attr("name"), check = $(`#listGroupCheck-${propertyId}`).prop("checked")
        if (propertyId && check == 1) formData.append(propertyId, $(this).val());
    })
  
    $(".listTextarea").each(function () {
        const propertyId = $(this).attr("name"), check = $(`#listGroupCheck-${propertyId}`).prop("checked")
        if (check == 1) formData.append(propertyId, $(this).val());
    })

    const route = `${$("#listGroupRoute").val()}?ids=${ids}`
    xhttp.open("POST", route, true)
    xhttp.onload = function () {
        if (xhttp.readyState == 4) { 
            if (xhttp.status == 401) {
                $(".modal-body").html("")
                $("#groupModalForm").modal("hide")
                getLogin(loadPage)
            }
            else if (xhttp.status == 200) {
                getList(getSearchParams())
            }
            else toastr.error("A technical error has occured. PLease try again later")
        }
    }
    xhttp.send(formData)
}

const getList = (context, entity, view, searchParams) => {		

    // Execute the ajax request
    const xhttp = new XMLHttpRequest()
    let route = `${$("#listRoute").val()}`

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

    xhttp.open("GET", route, true)
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4) {
            if (xhttp.status == 401) getLogin(loadPage)
            else if (xhttp.status == 200) {

                if (xhttp.statusText.substring(0, 3) == "jwt") {
                    document.cookie = `JWT-${$("#instanceCaption").val()}${xhttp.statusText.substring(4)};path=/`
                }

                $("#dataView").html(xhttp.responseText)

                createCalendar(context, entity, view)
                displayChart(context, entity, view)

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

                $("#listGroupButton-0").hide()
                $("#listGroupButton-1").prop("disabled", true)
                $("#listGroupTr").hide()

                // Connect the sort anchors
                $(".listSortAnchor").click(function () {
                    criterion = $(this).attr("id").split("-")[1]
                    ascCriterion = $(".sortAnchorUp").attr("id")
                    descCriterion = $(".sortAnchorDown").attr("id")
                    if ("listSortAnchor-" + criterion == ascCriterion) dir = "-"
                    else if ("listSortAnchor-" + criterion == descCriterion) dir = ""
                    else dir = ""
                    $("#listOrderHidden").val(dir + criterion)
                    getList(context, entity, view, getSearchParams())
                })

                // Connect the more anchor
                $(".listMoreButton").click(function () {
                    $("#listLimitHidden").val("")
                    getList(context, entity, view, getSearchParams())
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

                $(".datepicker").datepicker()
                $(".timepicker").timepicker({ "timeFormat":"H:i:s", "step": 15, "scrollDefault": "now" })
                //$(".listSelectpicker").selectpicker()

                // Connect the grouped actions anchors
                $(".listGroupButton").click(function () {
                    $("#listGroupModal").html("")
                    $("#groupModalForm").modal("show")
                    getGroup()
                });

                // Connect the detail anchors
                $(".listDetailButton").click(function () {
                    const id = $(this).attr("id").split("-")[1]
                    $(this).removeClass("btn-outline-primary").addClass("btn-primary")
                    $("#listDetailModal").html("")
                    $("#listDetailModalForm").modal("show")
                    getDetail(context, entity, view, id, searchParams)
                })

                // Connect the distribution anchor
                $(".distributionAnchor").hide()
                var distributionValue = $("#distributionSelect").val()
                $("#distribution-" + distributionValue).show()
                $("#distributionSelect").change(function () {
                    $(".distributionAnchor").hide()
                    var distributionValue = $("#distributionSelect").val()
                    $("#distribution-" + distributionValue).show()
                })
            }
            else toastr.error("A technical error has occured. PLease try again later")
        }
    }
    xhttp.send()
}

$("#listDetailModalForm").on("hidden.bs.modal", function (e) {
    const refresh = $("#listRefreshHidden").val()
    if (refresh == "manual") {
        $("#refreshButton").removeClass("btn-default").addClass("btn-warning")
        $("#refreshButton").attr("disabled", false)
        $(".listDetailButton").removeClass("btn-primary").addClass("btn-outline-primary")
    }
    else getList(context, entity, view, getSearchParams())
})

$("#groupModalForm").on("hidden.bs.modal", function (e) {
    const refresh = $("#listRefreshHidden").val()
    if (refresh == "manual") {
        $("#refreshButton").removeClass("btn-default").addClass("btn-warning")
        $("#refreshButton").attr("disabled", false)
        $(".listDetailButton").removeClass("btn-primary").addClass("btn-outline-primary")
    }
    else getList(context, entity, view, getSearchParams())
})
