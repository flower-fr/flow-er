import { triggerGroup } from "/flBo/cli/controller/triggerGroup.js"

const triggerList = async ({ context, entity, view }, order = $("#flListOrderHidden").val()) => {		

    // Route with params

    let route = getListRoute()

    const params = getSearchParams()

    const where = params.join("|")
    if (where) route += `&where=${where}`

    if (order) route += `&order=${order}`

    let limit = parseInt($("#flListLimitHidden").val())
    route += `&limit=${limit}`

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

    $("#flList").html(listRenderer({ context, entity, view }, data))
    listCallback({ context, entity, view })

    triggerOrder({ context, entity, view })

    // Extend the displayed list

    $(".fl-list-more").click(function () {
        $("#flListLimitHidden").val(limit * 2)
        triggerList({ context, entity, view })
    })

    // Enable group action

    $(".fl-list-group").hide()

    // Trigger checking rows for group action

    $(".fl-list-check").click(function (e) {
        if (e.shiftKey) {
            const max = $(this).attr("data-row-id"), state = $(this).prop("checked")
            let min = 0
            $(".fl-list-check").each(function () {
                const i = parseInt($(this).attr("data-row-id"))
                if ($(this).prop("checked") && i < max) min = i
            })
            $(".fl-list-check").each(function () {
                const i = parseInt($(this).attr("data-row-id"))
                if (i >= min && i <= max) $(this).prop("checked", state)
            })
        } 

        let checked = 0, sumChecked = 0

        $(".fl-list-check").each(function () {
            if ($(this).prop("checked")) checked++

            let amount = $(this).attr("data-val")
            if (amount) {
                amount = parseFloat(amount)
                if ($(this).prop("checked")) sumChecked += amount
            }
        })

        if (checked > 0) {
            $(".fl-list-group").show()
            $(".fl-list-add").hide()
            $(".fl-list-count").text(checked)
            if (sumChecked) $(".fl-list-sum").text((Math.round(sumChecked * 100) / 100).toFixed(2))
        }
        else {
            $(".fl-list-group").hide()
            $(".fl-list-add").show()
            $(".fl-list-count").text("")
            $(".fl-list-sum").text("")
        }
    })

    // Trigger checking all

    $(".fl-list-check-all").click(function () {
        const state = $(this).prop("checked")
        $(".fl-list-check").prop("checked", state)
        $(".fl-list-check-all").prop("checked", state)

        if (state) {
            $(".fl-list-group").show()
            $(".fl-list-add").hide()

            let count = 0, sum = 0
            $(".fl-list-check").each(function () {
                count++
                let amount = $(this).attr("data-val")
                if (amount) {
                    amount = parseFloat(amount)
                    if ($(this).prop("checked")) sum += amount
                }
            })
            $(".fl-list-count").text(count)
            if (sum) $(".fl-list-sum").text((Math.round(sum * 100) / 100).toFixed(2))
        }
        else {
            $(".fl-list-group").hide()
            $(".fl-list-add").show()
            $(".fl-list-count").text("")
            if (sum) $(".fl-list-sum").text("")
        }
    })

    triggerDetail({ context, entity, view }, params)

    triggerTaskDetail({ context, entity, view }, params)

    triggerTaskAdd({ context, entity, view }, params)

    triggerGroup({ context, entity, view }, params)
    // Connect the grouped actions anchors
    // $(".fl-list-group").click(function () {
    //     getGroup(context, entity, view, params)
    // })
}

export { triggerList }