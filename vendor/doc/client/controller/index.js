const loadPage = async ({ entity, view }) => {

    let response = await fetch("/bo/config")
    const config = await response.json()
    response = await fetch("/bo/language")
    const translations = await response.json()
    response = await fetch("/bo/user")
    const user = await response.json()

    const context = {

        user: user,
        config: config,

        localize: (str) => {
            if (str[user.locale]) return str[user.locale]
            else return str.default
        },

        translate: (str) => {
            if (translations[user.locale][str]) {
                return translations[user.locale][str]
            }
            else return str
        },

        decodeDate: (str) => {
            if (str) {
                return new moment(str).format("DD/MM/YYYY")
            }
            return ""
        },

        decodeTime: (str) => {
            if (str) {
                return str
            }
        },

        isAllowed: (route) => {
            if (config.guard[route]) {
                for (let role of user.roles) {
                    if (config.guard[route].roles.includes(role)) return true
                }
                return false
            }
            else return false
        }
    }

    $(".sidenav").each(function () {
        const sidenav = $(this)
        new mdb.Sidenav(sidenav)
    })

    $(".columnsWidget").each(function () {
        const id = $(this).attr("id")
        const columnsData = JSON.parse(decodeURI($(`#${id}Data`).val()))
        $(`#${id}`).html(renderColumns({context}, columnsData))
        mdbListCallback({ context, entity, view })    
    })

    $(".searchWidget").each(function () {
        const id = $(this).attr("id")
        const searchData = JSON.parse(decodeURI($(`#${id}Data`).val()))
        $(`#${id}`).html(renderSearch({context}, searchData))
        searchCallback({ context, entity, view })
    })

    $(".calendarWidget").each(function () {
        const id = $(this).attr("id")
        const calendarData = JSON.parse(decodeURI($(`#${id}Data`).val()))
        $(`#${id}`).html(renderCalendar({context}, calendarData))
        calendarCallback({ context, entity, view }, calendarData)
    })


    const getTab = ({ context, entity, view }, tab, id, message, searchParams) => {

        const tabData = JSON.parse(decodeURI($(`#${id}Data`).val()))
        $(".renderUpdate").each(function () { 
            $("#detailPanel").html(renderUpdate({ context, entity, view }, tabData))
            updateCallback({ context, entity, view }, tabData)
        })
        $(".renderModalList").each(function () {
            $("#detailPanel").html(renderModalList({ context, entity, view }, tabData)) 
            modalListCallback({ context, entity, view }, tabData)
            triggerModalList({ context, entity, view }, tabData)
        })
        $(".document-cancel-btn").hide()
        $(".updateMessage").hide()
        $(".submitSpinner").hide()
    }

    $(".detailWidget").each(function () {
        const id = $(this).attr("id")
        const detailData = JSON.parse(decodeURI($(`#${id}Data`).val()))
        $(`#${id}`).html(renderDetail({context}, detailData))

        $(".detailTab").click(function () {
            const tabId = $(this).attr("id").split("-")[1]
            $(".detailTab").removeClass("active")
            $(this).addClass("active")
            getTab({ context, entity, view }, tabId, id, "", {})
        })

        getTab({ context, entity, view }, $("#defaultTab").val(), id, "", {})
    })
}

