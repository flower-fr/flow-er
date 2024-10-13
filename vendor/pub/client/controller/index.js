const getForm = async ({ context, entity, view }) => {

    const route = `/pub/csr/${entity}?view=${view}`
    const where = []
    $(".ssr-input").each(function () {
        const propertyId = $(this).attr("id")
        if ($(this).val()) {
            where.push(`${propertyId}:${$(this).val()}`)
        }
    })
    const response = await fetch(`${route}&where=${ where.join("|") }`)
    const data = await response.json()
    const csr = renderCsrMdb({ context, entity, view }, data)
    $("#csr").html(csr)
    mdbFormCallback()
}

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

    getForm({ context, entity, view })
    const mySelect = document.getElementById("place_id")
    mySelect.addEventListener("valueChanged.mdb.select", (e) => { 
        getForm({ context, entity, view })
    })
}

