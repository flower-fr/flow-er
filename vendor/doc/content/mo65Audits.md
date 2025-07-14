[[Main menu](menu.md)]

Audits
======

It is possible to specify for each data model an audit model that will serve to track changes in the table in a per-property basis. 

An audit entity shoud conform to this definition:

    "myAudit/model": {
        "entities": {
            "audit": { "table": "xx_audit" }
        },
        "properties": {
            "id": { "entity": "audit", "column": "id", "type": "primary" },
            "entity": { "entity": "audit", "column": "entity" },
            "row_id": { "entity": "audit", "column": "row_id", "type": "int" },
            "property": { "entity": "audit", "column": "property" },
            "value": { "entity": "audit", "column": "value" },
            "previous_value": { "entity": "audit", "column": "previous_value" },

            "visibility": { "entity": "audit", "column": "visibility" },
            "touched_at": { "entity": "audit", "column": "touched_at", "type": "datetime" },
            "touched_by": { "entity": "audit", "column": "touched_by", "type": "int" }
       }
    }

As a default, the audit entity is the standard "audit/model" data model.

As an example, let's complete the contact data model with auditable properties:

    "contact/entity": {
        "entities": {
            "contact": { "table": "xx_contact" }
            "place": { "table": "xx_place", "foreignEntity": "contact", "foreignKey": "place_id" }
        },
        "properties": {
            "id": { "entity": "contact", "column": "id", "type": "primary" },
            "status": { "entity": "contact", "column": "status", "audit": true },
            "firstName": { "entity": "contact", "column": "first_name", "audit": true },
            "lastName": { "entity": "contact", "column": "last_name", "audit": true },
            "formatted": { "column": "formatted", "type": "CONCAT", "components": ["last_name", "first_name"] },
            "place_id": { "entity": "contact", "column": "place_id", "type": "int", "audit": true },

            "place_name": { "entity": "place", "column": "name" }
        }
    }
