const triggerShortcuts = async ({ context, entity, view }, route) => {

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
    $("#shortcutsPanel").html(renderShortcuts({ context, entity, view }, data))

    $(".flBadge").hide()

    $('.shortcutsParams').each(function () {
        const id = $(this).attr('id').split('-')[1], route = $("#countRoute").val()
        const where = $(this).val()
        const params = {}
        for (let param of where.split("|")) {
            const pair = param.split(":")
            params[pair[0]] = pair[1]
        }

        getCount({ context, entity, view }, id, route, params)
        getCountCallback(id, route, params)()
    })
    $("#badgeRefreshButton").click(refreshBadges)
}
