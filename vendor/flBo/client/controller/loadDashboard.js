import { triggerSearch } from "/flBo/cli/controller/triggerSearch.js"
import { triggerList } from "/flBo/cli/controller/triggerList.js"
import { renderChart } from "/flBo/cli/view/renderChart.js"

const [entity, view] = Object.values(JSON.parse(decodeURI(document.getElementById("module-script").dataset.json)))

const triggerDoughnut = async ({ context, view }) => {

    await $(".fl-dataview").each(async function () {

        const entity = $(this).attr("data-fl-entity"), where = $(this).attr("data-fl-where")
        let route = `/flBo/list/${ entity }?view=${ view }${ (where) ? `&where=${ where }` : "" }`

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

        const data = await response.json(), label = $(this).attr("data-fl-label"), id = `chart-${ $(this).attr("data-fl-identifier") }`
        $(this).html(await renderChart({ context, entity, view }, label, data, id))
        dashboardCallback({ context, entity, view }, id)
    })
}

const loadDashboard = async ({ entity, view }, dashboardConfig) => {
    let response = await fetch("/flBo/config")
    const config = await response.json()
    response = await fetch("/flBo/instance")
    const instance = await response.json()
    response = await fetch("/flBo/language")
    const translations = await response.json()
    response = await fetch("/flBo/user")
    const user = await response.json()

    const context = {

        instance: instance,
        user: user,
        config: config,

        localize: (str) => {
            if (str[user.locale]) return str[user.locale]
            else return str.default
        },

        translate: (str) => {
            if (translations[user.locale] && translations[user.locale][str]) {
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

    triggerSearch({ context, entity, view })
    triggerDoughnut({ context, view })

    const modal = document.getElementById("flModal")
    modal.addEventListener("hidden.mdb.modal", (e) => {
        triggerList({ context, entity, view })
    })
}

loadDashboard({ entity, view })
