[[Main menu](menu.md)]

Data models
===========

The purpose of data models in _Flow-ER_ is the generation behind the scene of possibly complex but efficient SQL requests, given simple descriptive structures as arguments.

Data models are entries in the [config](fr20Config) whith keys having the form _/\<entityName\>/model_. We will use _contact/model_ below as an example.

The value of a data model entry is an object with two entries : _entities_ and _properties_.

Entities both define the new SQL entity and describe the associations (joins) between this new entity and  already defined entities. Each entity should specify the _table_ attribute which is the SQL name of the entity.

    "contact/entity": {
        "entities": {
            "contact": { "table": "xx_contact" }
        },
        "properties": {}
    }

A joined entity should describe in addition the foreign entity that references it and the foreign key in the foreign entity matching the primary key of the joined entity. For example, let's suppose a contact belongs to a place which is referenced as a place id in the contact entity:

    "contact/entity": {
        "entities": {
            "contact": { "table": "xx_contact" }
            "place": { "table": "xx_place", "foreignEntity": "contact", "foreignKey": "place_id", "primaryKey: "id" }
        },
        "properties": {}
    }

The primary key in a joined entity is optional and defaults to _id_ so the above example can be simplified as:

    "contact/entity": {
        "entities": {
            "contact": { "table": "xx_contact" }
            "place": { "table": "xx_place", "foreignEntity": "contact", "foreignKey": "place_id" }
        },
        "properties": {}
    }

Our advice: Always use a primary key as a foreign key. While it is theoretically possible to use any SQL property as a foreign key in a SQL SELECT, RDBMS like _MYSQL_ ensure efficiency if a primary key of the joined entity is used, which is indexed by design. In other cases, even explicitly setting an index may not lead to an acceptable result in some cases.
