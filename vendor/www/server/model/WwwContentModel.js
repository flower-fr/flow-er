const { Model } = require("../../../../vendor/flCore/server/model/config/Model")

class WwwContentModel extends Model {

    identifier = "www_content"

    entities = {
        www_content: { table: "www_content" }
    }

    properties = {
        id: { entity: "www_content", column: "id", type: "primary" },
        identifier: { entity: "www_content", column: "identifier" },
        text: { entity: "www_content", column: "text", type: "json" },
        image: { entity: "www_content", column: "image" },
        list: { entity: "www_content", column: "list", type: "json" },
    }
}

module.exports = {
    WwwContentModel
}