const getCountCallback = (id, route, params) => {

    const where = []
    for (let key of Object.keys(params)) {
        where.push(`${key}:${params[key]}`)
    }

    route += `?where=${where.join("|")}`

    // Update the counter badge
    return async () => {

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

        $(`#flBadge-${id}`).show()
        $(`#flBadge-${id}`).text((await response.json()).data[0].id)
    }
}

const refreshBadges = () => {
    $('.shortcutsParams').each(function () {
        const id = $(this).attr('id').split('-')[1], route = $("#countRoute").val(), where = $(this).val()
        const params = {}
        for (let param of where.split("|")) {
            const pair = param.split(":")
            params[pair[0]] = pair[1]
        }
        $(`#badge-${id}`).removeClass('badge-success').addClass('badge-light')
        getCountCallback(id, route, params)()
    })
}

const getCount = ({ context, entity, view }, id, route, params) => {
    
    $(`#anchor-${id}`).click(function () {
        triggerList({ context, entity, view }, params)
        if (route) {
            getCountCallback(id, route, params)()
        }
    })
}
