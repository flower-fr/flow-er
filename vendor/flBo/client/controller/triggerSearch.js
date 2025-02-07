
const triggerSearch = async ({ context, entity, view }, param = false) => {
    
    // Route with params

    let route = getSearchRoute()
    if (param) route += param

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

    $("#sidenav").html(searchRenderer({ context, entity, view }, data))
    searchCallback({ context, entity, view })

    // Trigger search properties change
    $(".fl-search-change").each(function () {
        const propertyId = $(this).attr("data-property-id")
        $(`#flSearch-${propertyId}`).change(function() {
            const param = `&where=${propertyId}:${$(`#flSearch-${propertyId}`).val()}`
            triggerSearch({ context, entity, view }, param)
        })
    })

    /**
     * Search shortcuts
     */
    $(".fl-search-shortcut").hide()
    $(".fl-search-shortcut-close").click(function () {
        const propertyId = $(this).attr("data-property-id")
        $(`#flSearch-${propertyId}`).val("")
        $(`#flSearchMin-${propertyId}`).val("")
        $(`#flSearchMax-${propertyId}`).val("")
        if (mdb) {
            let instance = mdb.Select.getInstance(`#flSearch-${propertyId}`)
            if (instance) instance.setValue("")
        }
        triggerList({ context, entity, view })
        $(`#flSearchShortcut-${propertyId}`).hide()
    })

    /**
     * Actualize the search
     */

    $(".fl-search-item").each(function () {
        const value = $(this).val()
        if (value && (!Array.isArray(value) || value.length != 0)) {
            const propertyId = $(this).attr("id").split("-")[1]
            $(`#flSearchShortcut-${propertyId}`).show()
        }
    })

    $(".fl-search-refresh").click(function () {
        $(".fl-search-item").each(function () {
            const value = $(this).val()
            if (value && (!Array.isArray(value) || value.length != 0)) {
                const propertyId = $(this).attr("id").split("-")[1]
                $(`#flSearchShortcut-${propertyId}`).show()
            }
        })
        triggerList({ context, entity, view })
    })

    /**
     * Erase the search
     */
    $(".fl-search-erase").click(function() {
        $(".fl-search-shortcut").hide()
        $(".fl-search-item").each(function () {
            $(this).val("")
            const propertyId = $(this).attr("id").split("-")[1]
            if (mdb) {
                let instance = mdb.Select.getInstance(`#flSearch-${propertyId}`)
                if (instance) instance.setValue("")
            }
        })
        $(".flSearchHeaderIcon").hide()
        triggerList({ context, entity, view })
    })
    
    /**
     * Autocomplete (for MDB)
     */
    $(".fl-search-form-outline").each(function () {
        if (mdb) {
            const autocomplete = document.getElementById($(this).attr("id"))
            if (autocomplete) {
                const data = $(this).attr("data-values").split(",")
                const dataFilter = (value) => {
                    return data.filter((item) => {
                        return item.toLowerCase().startsWith(value.toLowerCase())
                    })
                }
                new mdb.Autocomplete(autocomplete, {
                    filter: dataFilter
                })    
            }
        }
    })

    /**
     * Item change
     */ 
    $(".fl-search-item").change(function () {
        const propertyId = $(this).attr("data-property-id")
        const val = $(`#flSearch-${propertyId}`).val(), empty = (Array.isArray(val) && val.length == 0 || !val) ? true : false
        const minVal = $(`#flSearchMin-${propertyId}`).val(), minEmpty = (!minVal) ? true : false
        const maxVal = $(`#flSearchMax-${propertyId}`).val(), maxEmpty = (!maxVal) ? true : false
        if (empty && minEmpty && maxEmpty) $(`#flSearchHeaderIcon-${propertyId}`).hide()
        else $(`#flSearchHeaderIcon-${propertyId}`).show()
    })
    
    $(".fl-global").click(function () {
        const route = $(this).attr("data-route")
        getGlobal({ context, entity, view }, route)
    })

    triggerList({ context, entity, view })
}
