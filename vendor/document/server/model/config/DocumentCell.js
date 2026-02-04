const { Model } = require("../../../../flCore/server/model/config/Model")

class DocumentCell extends Model {

    identifier = "document_cell"

    entities = {
        document_cell: { table: "document_cell" },

        // Foreign entities
        document: { table: "document", foreignKey: "document_id", foreignEntity: "document_cell" },
    }

    properties = {
        id: { entity: "document_cell", column: "id", type: "primary" },
        document_id: { entity: "document_cell", column: "document_id", type: "int" },
        content: { entity: "document_cell", column: "content" },
        row: { entity: "document_cell", column: "row", type: "int" },
        column: { entity: "document_cell", column: "column", type: "int" },

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