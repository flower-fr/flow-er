const acl_event = {
    get: {
        properties: {
            "caption":              { "roles": ["responsible"] },
            "date":                 { "roles": ["responsible"] },
            "end_date":             { "roles": ["responsible"] },
            "end_time":             { "roles": ["responsible"] },
            "id":                   { "roles": ["responsible"] },
            "location":             { "roles": ["responsible"] },
            "start_time":           { "roles": ["responsible"] },
            touched_at:             { "roles": ["responsible"] },
            touched_by:             { "roles": ["responsible"] },
        }
    },
    post: {
        properties: {
            "caption":              { "roles": ["responsible"] },
            "date":                 { "roles": ["responsible"] },
            "end_date":             { "roles": ["responsible"] },
            "end_time":             { "roles": ["responsible"] },
            "location":             { "roles": ["responsible"] },
            "start_time":           { "roles": ["responsible"] },
        }
    },
    delete: {},
}

module.exports = acl_event