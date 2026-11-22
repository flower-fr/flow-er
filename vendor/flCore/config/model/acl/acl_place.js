const acl_place = {
    get: {
        properties: {
            "id":                   { "roles": ["api", "responsible"] },
            "adr_city":             { "roles": ["api", "responsible"], "description": "City of the place" },
            "adr_country":          { "roles": ["api", "responsible"], "description": "Country of the place" },
            "adr_extended":         { "roles": ["api", "responsible"], "description": "Extended address of the place" },
            "adr_street":           { "roles": ["api", "responsible"], "description": "Street of the place" },
            "adr_zip":              { "roles": ["api", "responsible"], "description": "Zip code of the place" },
            "identifier":           { "roles": ["api", "responsible"], "description": "Legal identifier of the place" },
            "keywords":             { "roles": ["api", "responsible"], "description": "Keywords to find the place" },
            "name":                 { "roles": ["api", "responsible"], "description": "Name of the place" },
            "status":               { "roles": ["api", "responsible"], "description": "active vs closed" },
            "touched_at":           { "roles": ["api", "responsible"], "description": "Timestamp of the last modification" },
            "touched_by":           { "roles": ["api", "responsible"], "description": "Id of the user who last modified" },
        }
    },
    post: {
        properties: {
            "adr_city":             { "roles": ["responsible"], "description": "City of the place" },
            "adr_country":          { "roles": ["responsible"], "description": "Country of the place" },
            "adr_extended":         { "roles": ["responsible"], "description": "Extended address of the place" },
            "adr_street":           { "roles": ["responsible"], "description": "Street of the place" },
            "adr_zip":              { "roles": ["responsible"], "description": "Zip code of the place" },
            "name":                 { "roles": ["responsible"], "description": "Name of the place" },
            "status":               { "roles": ["responsible"], "description": "active vs closed" },
        }
    },
    delete: {},
}

module.exports = acl_place