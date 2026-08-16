const fs = require("fs")

const acl = require("./acl.js")
const defaultTr = require("./translations/defaultTr.js")

for (const [viewModel, roles] of Object.entries(acl)) {
    const js = require(`./${viewModel}`)

    // ACL
    js.acl = { roles }

    // Translations
    js.translations = { default: defaultTr.translations }
    for (const key of defaultTr.languages) {
        const language = require(`./translations/${ key }.js`)
        js.translations[key] = language.translations
    }

    fs.writeFileSync(`../viewModel_${viewModel}.json`, JSON.stringify({
        [`viewModel_${viewModel}`]: js
    }))
}
