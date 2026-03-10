const Ddl = require("../../../../flCore/utils/Ddl")

class DocumentCell extends Ddl {

    identifier = "document_cell"

    entities = {
        document_cell: { table: "document_cell" },

        // Foreign entities
        document: { table: "document", foreignKey: "document_id", foreignEntity: "document_cell" },
    }

    properties = {
        id: { entity: "document_cell", column: "id", type: "primary" },
        identifier: { entity: "document_cell", column: "identifier" },
        level: { entity: "document_cell", column: "level", type: "int" },
        parent: { entity: "document_cell", column: "parent" },
        before: { entity: "document_cell", column: "before" },
        content: { entity: "document_cell", column: "content", type: "json" },
        document_id: { entity: "document_cell", column: "document_id", type: "int" },
        state: { entity: "document_cell", column: "state" },

        folder: { entity: "document", column: "folder" },
        name: { entity: "document", column: "name" },
        mime: { entity: "document", column: "mime" },
        version: { entity: "document", column: "version", type: "smallint" },

        visibility: { entity: "document_cell", column: "visibility", audit: true },
        touched_at: { entity: "document_cell", column: "touched_at", type: "datetime" },
        touched_by: { entity: "document_cell", column: "touched_by", type: "int" },
    }
}

module.exports = {
    DocumentCell
}