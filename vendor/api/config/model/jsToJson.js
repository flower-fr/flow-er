const fs = require("fs")

const acl = require("./acl/acl.js")

for (const model of Object.keys(acl)) {
    const js = require(`./${ model }`), acl = require(`./acl/acl_${model}`)

    // ACL
    js.acl = acl

    fs.writeFileSync(`../model_${ model }.json`, JSON.stringify({
        [`${ model }/model`]: js
    }))
}
