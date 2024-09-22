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

    await loadView({ context, entity, view })

    const shortcutsRoute = $("#shortcutsRoute").val()
    if (shortcutsRoute) triggerShortcuts({ context, entity, view }, shortcutsRoute)
    triggerList({ context, entity, view }, {})
}

