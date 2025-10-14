const fs = require("fs")

class Model {

    serialize = (path) =>
    {
        fs.writeFileSync(path, JSON.stringify({
            "audit/model": {
                entities: this.entities,
                properties: this.properties
            }
        }))
    }
}

module.exports = {
    Model
}