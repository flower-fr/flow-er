const fs = require("fs")

class Model 
{
    serialize = (path) =>
    {
        this.properties.id = { entity: this.identifier, column: "id", type: "primary" }
        this.properties.visibility = { entity: this.identifier, column: "visibility", audit: true }
        this.properties.touched_at = { entity: this.identifier, column: "touched_at", type: "datetime" }
        this.properties.touched_by = { entity: this.identifier, column: "touched_by", type: "int" }

        const json = {}
        json[`${this.identifier}/model`] = {
            entities: this.entities,
            properties: this.properties,
            audit: this.audit || "audit",
        }
        fs.writeFileSync(`${path}/${this.identifier}.json`, JSON.stringify(json))
    }
}

module.exports = {
    Model
}