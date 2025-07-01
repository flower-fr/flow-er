import { getList, triggerList } from "/studio/cli/outbound/viewModels/listViewModel.js"
import { indexView } from "/studio/cli/outbound/views/indexView.js"
import { tableView } from "/studio/cli/outbound/views/tableView.js"
import { mdbCreate, mdbInitSelect, mdbDispose } from "/studio/cli/outbound/triggers/mdbCallback.js"

const [entity] = Object.values(JSON.parse(decodeURI(document.getElementById("module-script").dataset.json)))

const loadPage = async ({ entity }) => {
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
        }
    }

    $("#dataview").html(indexView({ context, entity }))

    const data = await getList({ entity })
    $("#flList").html(tableView({ context, entity }, data.rows, data.properties))

    triggerList({ entity }, mdbCreate, mdbInitSelect, mdbDispose)
}

loadPage({ entity })
