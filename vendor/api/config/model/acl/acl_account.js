const acl_account = {
    get: {
        properties: {
            adr_city: {},
            adr_street: {},
            adr_zip: {},
            id: {},
            contact_1_id: {},
            email: {},
            keywords: {},
            n_first: {},
            n_fn: {},
            n_last: {},
            place_id: {},
            place_name: {},
            place_region: {},
            revenue: { roles: ["responsible"] },
            status: {},
            tel_cell: {},
            tel_work: {},
            touched_at: {},
            touched_by: {},
        }
    },
    post: {
        properties: {
            adr_city: {},
            adr_street: {},
            adr_zip: {},
            email: {},
            n_first: {},
            n_last: {},
            place_id: {},
            revenue: {},
            status: {},
            tel_cell: {},
            tel_work: {},
        }
    },
    delete: {},
}

module.exports = acl_account