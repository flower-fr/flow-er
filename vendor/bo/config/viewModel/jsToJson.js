const fs = require("fs")
const defaultTr = require("./translations/defaultTr.js")

const entitiesViews = {
    account: ["default", "suggestion"],
    catalogue: ["default"],
}

let js = require("./navbar")
js.translations = { default: defaultTr.translations }
for (const key of defaultTr.languages) {
    const language = require(`./translations/${ key }.js`)
    js.translations[key] = language.translations
}
fs.writeFileSync("../viewModel_navbar_flower.json", JSON.stringify({
    ["viewModel_navbar_flower"]: js
}))

// js = require("./rules")
// fs.writeFileSync("../viewModel_rules_flower.json", JSON.stringify({
//     ["viewModel_rules_flower"]: js
// }))

for (const [entity, views] of Object.entries(entitiesViews)) {
    for (const view of views) {

        const acl = require(`./${ entity }/${ view }/acl.js`)

        for (const [viewModel, roles] of Object.entries(acl)) {
            const js = require(`./${ entity }/${ view }/${viewModel}`)

            // Properties
            if (js.entity) {
                const propertiesConfig = require(`./${ entity }/properties`).properties, properties = {}
                if (propertiesConfig) {
                    for (const property of js.properties) properties[property] = propertiesConfig[property]
                    js.properties = properties        
                }
            }
            // ACL
            js.acl = { roles }

            // Translations
            js.translations = { default: defaultTr.translations }
            for (const key of defaultTr.languages) {
                const language = require(`./translations/${ key }.js`)
                js.translations[key] = language.translations
            }

            fs.writeFileSync(`../viewModel_${ viewModel }_${ entity }_${ view }.json`, JSON.stringify({
                [`viewModel_${ viewModel }_${ entity }_${ view }`]: js
            }))
        }
    }
}
