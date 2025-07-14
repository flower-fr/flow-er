[[Main menu](menu.md)]

Properties
==========

The _properties_ entry in data models both define the properties of the main SQL entity and list the properties of the joined entities to use in association with the main entity.

Each property should specify the _entity_ attribute which refer to a key of the _entities_ entry, and the _column_ attribute which is the SQL name of the property.

Only for the main entity properties, the _type_ attribute can be specified in order to properly initialize the default values of properties when new rows are added to the table. 

The available SQL types are:

    primary
    int
    tinyint
    decimal which matches to SQL DECIMAL(14,4)
    char
    varchar
    mediumtext
    date
    time
    datetime
    json which matches to SQL MEDIUMTEXT with automatic parsing and serialization
    mediumblob

For columns of type char or varchar, the optional _max_length_ attribute, defaulting to 255, specifies the maximum length of the property value.

When not specified, the type attributes defaults to a varchar of a maximum size of 255.

The special type _concat_ defines a derived (not materialized in the database) columns which is the concatenation of other columns. The _components_ attributes, mandatory in his case, lists the columns to concatenate, separated with a space character.

    "contact/entity": {
        "entities": {
            "contact": { "table": "xx_contact" }
            "place": { "table": "xx_place", "foreignEntity": "contact", "foreignKey": "place_id" }
        },
        "properties": {
            "id": { "entity": "contact", "column": "id", "type": "primary" },
            "status": { "entity": "contact", "column": "status" },
            "firstName": { "entity": "contact", "column": "first_name" },
            "lastName": { "entity": "contact", "column": "last_name" },
            "formatted": { "column": "formatted", "type": "CONCAT", "components": ["last_name", "first_name"] },
            "place_id": { "entity": "contact", "column": "place_id", "type": "int" },
            "place_name": { "entity": "place", "column": "name" }
        }
    }
