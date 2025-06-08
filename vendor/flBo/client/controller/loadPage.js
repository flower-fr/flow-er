import { triggerSearch } from "/flBo/cli/controller/triggerSearch.js"
import { triggerList } from "/flBo/cli/controller/triggerList.js"

const [entity, view] = Object.values(JSON.parse(decodeURI(document.getElementById("module-script").dataset.json)))

const loadPage = async ({ entity, view }) => {
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
    
    if (mdb) $("#flListDetailModalForm").each(function () {
        const modal = $(this)
        new mdb.Modal(modal)    

        $(".btn-close").each(function () {
            const btn = $(this)
            new mdb.Ripple(btn)    
        })
    })

    // const shortcutsRoute = $("#shortcutsRoute").val()
    // if (shortcutsRoute) triggerShortcuts({ context, entity, view }, shortcutsRoute)
    triggerSearch({ context, entity, view })

    const myModalEl = document.getElementById("flListDetailModalForm")
    myModalEl.addEventListener("hidden.mdb.modal", (e) => {
        triggerList({ context, entity, view })
    })

    const modal = document.getElementById("flModal")
    modal.addEventListener("hidden.mdb.modal", (e) => {
        triggerList({ context, entity, view })
    })
}

loadPage({ entity, view })
