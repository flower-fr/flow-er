const loadForm = async ({ entity, view }, data) => {

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

    // Fetch body

    response = await fetch(`/bo/form/${entity}?view=${view}`)
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

    const formData = await response.json()
    formData.row = data.row
    const form = formRenderer({ context, entity, view }, formData)
    $("#form").html(form)
    formCallback({ context, entity, view })
}
