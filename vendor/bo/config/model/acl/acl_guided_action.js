const acl_guided_action = {
    get: {
        properties: {
            entity: {},
            id: {},
            identifier: {},
            profile_id: {},
            status: {},
            view: {},
        }
    },
    put: {
        properties: {
            entity: {},
            profile_id: {},
            status: {},
            view: {},
        }
    },
    post: {
        properties: {
            status: {},
        }
    },
    delete: {},
}

module.exports = acl_guided_action