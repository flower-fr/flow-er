const ddlProperty = (entity, propertyId, property) => {
    const maxLength = (property.max_length) ? property.max_length : 255
    let type = (property.length) ? `CHAR(${property.length}) DEFAULT ''` : `VARCHAR(${maxLength}) DEFAULT ''`
    if (property.entity == entity && property.type != "tag") {
        if (["primary", "foreign"].includes(property.type)) type = "INT(11) DEFAULT NULL"
        else if (property.type == "date") type = "DATE DEFAULT NULL"
        else if (property.type == "time") type = "TIME DEFAULT NULL"
        else if (property.type == "datetime") type = "DATETIME DEFAULT NULL"
        else if (property.type == "int") type = "INT(11) DEFAULT 0"
        else if (property.type == "tinyint") type = "TINYINT DEFAULT 0"
        else if (property.type == "decimal") type = "DECIMAL(14,4) DEFAULT 0"
        else if (property.max_length && property.max_length > 255) type = "MEDIUMTEXT"
        else if (property.type == "mediumtext") type = "MEDIUMTEXT"
        else if (property.type == "mediumblob") type = "MEDIUMBLOB"
        else if (property.type == "json") type = "MEDIUMTEXT"
        
        if (property.type == "primary") {
            return `  \`${propertyId}\` ${type}`
        }
        else {
            return `  \`${propertyId}\` ${type}`
        }
    }
    return ""
}

const ddlEntity = (context, entity, propertyId) => {
    const model = context.config[`${entity}/model`]
    let ddl = []

    if (propertyId) {
        let previous
        for (let id of Object.keys(model.properties)) {
            const property = model.properties[id]
            if (id == propertyId) {
                ddl.push(`ALTER TABLE \`${entity}\` ADD `)
                ddl.push(ddlProperty(entity, propertyId, property))
                ddl.push(`AFTER \`${previous}\`;`)
                ddl.push("\n")
                return ddl
            }
            if (property.entity == entity && property.type != "tag") previous = id
        }
    }

    ddl.push(`CREATE TABLE \`${entity}\` (`)
    const propDdl = []
    for (const [propertyId, property] of Object.entries(model.properties)) {
        const propertyDdl = ddlProperty(entity, propertyId, property)
        if (propertyDdl) propDdl.push(propertyDdl)
    }
    ddl.push(propDdl.join(",\n"))
    ddl.push(") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;")
    ddl = [ddl.join("\n")]

    ddl.push(`ALTER TABLE \`${entity}\` ADD PRIMARY KEY (\`id\`);`)

    ddl.push(`ALTER TABLE \`${entity}\` MODIFY \`id\` int(11) NOT NULL AUTO_INCREMENT;`)

    return ddl
}

module.exports = {
    ddlEntity
}