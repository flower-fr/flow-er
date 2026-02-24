const fs = require("fs")

module.exports = class Ddl 
{
    identifier = undefined
    entities = undefined
    properties = undefined

    ddlProperty = (property) =>
    {
        const maxLength = (property.max_length) ? property.max_length : 255
        let type = (property.length) ? `CHAR(${property.length}) DEFAULT ''` : `VARCHAR(${maxLength}) DEFAULT ''`
        if (property.entity === this.identifier && /* deprecated */ property.type != "tag") {
            if (["primary", "foreign"].includes(property.type)) type = "INT(11) DEFAULT NULL"
            else if (property.type === "date") type = "DATE DEFAULT NULL"
            else if (property.type === "time") type = "TIME DEFAULT NULL"
            else if (property.type === "datetime") type = "DATETIME DEFAULT NULL"
            else if (property.type === "int") type = "INT(11) DEFAULT 0"
            else if (property.type === "tinyint") type = "TINYINT DEFAULT 0"
            else if (property.type === "decimal") type = "DECIMAL(14,4) DEFAULT 0"
            else if (property.max_length && property.max_length > 255) type = "MEDIUMTEXT"
            else if (property.type === "mediumtext") type = "MEDIUMTEXT"
            else if (property.type === "mediumblob") type = "MEDIUMBLOB"
            else if (property.type === "json") type = "MEDIUMTEXT"
            if (property.type === "primary") {
                return `  \`${ property.column }\` ${type}`
            }
            else {
                return `  \`${ property.column }\` ${type}`
            }
        }
        return ""
    }

    ddlEntity = (propertyId) =>
    {
        let ddl = []

        if (propertyId) {
            let previous
            for (let id of Object.keys(this.properties)) {
                const property = this.properties[id]
                if (id === propertyId) {
                    ddl.push(`ALTER TABLE \`${ this.entities[this.identifier].table }\` ADD `)
                    ddl.push(this.ddlProperty(property))
                    ddl.push(`AFTER \`${previous}\`;`)
                    ddl.push("\n")
                    return ddl
                }
                if (property.entity === this.identifier && property.type != "tag") previous = id
            }
        }
        ddl.push(`CREATE TABLE \`${ this.entities[this.identifier].table }\` (`)
        const propDdl = []
        for (const [propertyId, property] of Object.entries(this.properties)) {
            const propertyDdl = this.ddlProperty(property)
            if (propertyDdl) propDdl.push(propertyDdl)
        }
        ddl.push(propDdl.join(",\n"))
        ddl.push(") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;")
        ddl = [ddl.join("\n")]
        ddl.push(`ALTER TABLE \`${ this.entities[this.identifier].table }\` ADD PRIMARY KEY (\`id\`);`)
        ddl.push(`ALTER TABLE \`${ this.entities[this.identifier].table }\` MODIFY \`id\` int(11) NOT NULL AUTO_INCREMENT;`)
        return ddl.join("\n")
    }

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
        }
        if (this.audit) {
            json[`${this.identifier}/model`]["audit"] = this.audit
        }
        fs.writeFileSync(`${path}/${this.identifier}.json`, JSON.stringify(json))
    }
}
