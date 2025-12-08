const fs = require("fs")

class WwwContent
{
    constructor({ identifier, text = "", image = "", list = [] }) {
        this.content = { identifier, text, image, list }
        this.identifier = identifier
    }

    serialize = (path) =>
    {
        const json = {}
        json[`www.p-pit.fr/${this.identifier}`] = this.content
        fs.writeFileSync(`${path}/${this.identifier}.json`, JSON.stringify(json))
    }
}

module.exports = {
    WwwContent
}