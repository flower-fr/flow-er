const fs = require("fs")

const acl = require("./acl/acl.js")

for (const model of Object.keys(acl)) {
    const js = require(`./${ model }`), acl = require(`./acl/acl_${model}`)
    js.properties.visibility = {
        entity: model,
        column: "visibility",
        audit: true
    }
    js.properties.touched_at = {
        entity: model,
        column: "touched_at",
        type: "datetime"
    }
    js.properties.touched_by = {
        entity: model,
        column: "touched_by",
        type: "int"
    }

    // ACL
    js.acl = acl
    js.acl.get.properties.touched_at = {}
    js.acl.get.properties.touched_by = {}

    fs.writeFileSync(`../model_${ model }.json`, JSON.stringify({
        [`${ model }/model`]: js
    }))
}
