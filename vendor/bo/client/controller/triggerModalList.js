const triggerModalList = ({ context, entity, view }, data) => {
    $(".modalListDetailButton").click(async function () {
        const id = $(this).attr("id").split("-")[1]
        const route = $(`#modalListTabsRoute-${id}`).val()
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
        $(".modalListTabsPanel").html("")
        $(`#modalListTabsPanel-${id}`).html(renderModalListTabs({ context, entity, view }, data)) 
        modalListTabsCallback({ context, entity, view }, data)
        triggerModalListTab({ context, entity, view }, data)
    })
}