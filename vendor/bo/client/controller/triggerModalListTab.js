const triggerModalListTab = async ({ context, entity, view }, data) => {
    const tabId = $("#modalListDefaultTab").val()
    const route = $(`#modalListFormRoute-${tabId}`).val()
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

    data = await response.json()
    $(`#modalListForm-${data.id}`).html(renderModalListForm({ context, entity, view }, data)) 
    modalListFormCallback({ context, entity, view }, data)
    //triggerModalListForm({ context, entity, view }, data)
}