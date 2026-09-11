const fs = require("fs")

const acl = require("./acl.js")

for (const [viewModel, roles] of Object.entries(acl)) {
    const js = require(`./${viewModel}`)

    // Properties
    if (js.entity) {
        const propertiesConfig = require(`./properties_${js.entity}`).properties, properties = {}
        if (propertiesConfig) {
            for (const property of js.properties) properties[property] = propertiesConfig[property]
            js.properties = properties        
        }
    }

    // ACL
    js.acl = { roles }

    // Translations
    // js.translations = { default: defaultTr.translations }
    // for (const key of defaultTr.languages) {
    //     const language = require(`./translations/${ key }.js`)
    //     js.translations[key] = language.translations
    // }

    fs.writeFileSync(`../viewModel_${viewModel}.json`, JSON.stringify({
        [`viewModel_${viewModel}`]: js
    }))
}
