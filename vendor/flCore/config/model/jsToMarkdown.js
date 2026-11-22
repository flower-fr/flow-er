const fs = require("fs")

const acl = require("./acl/acl.js")
for (const [model, args] of Object.entries(acl)) {
    const js = require(`./${ model }`)
    let acl
    try { acl = require(`./acl/acl_${model}`) } catch (e) { null }
    if (acl) {
        let hasApiRole = false
        let md = "[index](index.md)\n\n# Entity **```" + model + "```**\n\n"
        if (args.description) {
            md += `## ${ args.description }\n\n`
        }
        if (acl) {
            for (const method of Object.keys(acl)) {
                if (acl[method].properties && Object.keys(acl[method].properties).find((prop) => acl[method].properties[prop].roles.includes("api")) !== undefined) {
                    hasApiRole = true
                    md += `## ${ method }\n\n`
                    md += "| property | description | type |\n"
                    md += "| --- | --- | --- |\n"
                    for (const propertyId of Object.keys(acl[method].properties)) {
                        const property = js.properties[propertyId]
                        const type = (property.type) ? property.type : "varchar"
                        if (acl[method].properties[propertyId].roles.includes("api")) {
                            md += `| ${ propertyId } | ${ acl[method].properties[propertyId].description || "" } | ${ type } |\n`
                        }
                    }
                }
                md += "\n"
            }
        }
        if (hasApiRole) {
            fs.writeFileSync(`../../doc/api_${ model }.md`, md)
        }
    }
}
