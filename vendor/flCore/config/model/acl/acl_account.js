const acl_account = {
    get: {
        properties: {
            id:                     { roles: ["responsible"], description: "The unique identifier for the account" },
            adr_city:               { roles: ["api", "responsible"], description: "The city of the account's address" },
            adr_street:             { roles: ["responsible"], description: "The street of the account's address" },
            adr_zip:                { roles: ["responsible"], description: "The zip code of the account's address" },
            contact_1_id:           { roles: ["responsible"], description: "The ID of the first contact for the account" },
            email:                  { roles: ["responsible"], description: "The email address for the account" },
            keywords:               { roles: ["responsible"], description: "Keywords associated with the account" },
            n_first:                { roles: ["responsible"], description: "The first name of the account holder" },
            n_fn:                   { roles: ["responsible"], description: "The full name of the account holder" },
            n_last:                 { roles: ["responsible"], description: "The last name of the account holder" },
            place_id:               { roles: ["responsible"], description: "The ID of the place associated with the account" },
            place_name:             { roles: ["responsible"], description: "The name of the place associated with the account" },
            place_region:           { roles: ["responsible"], description: "The region of the place associated with the account" },
            revenue:                { roles: ["responsible"], description: "The revenue of the account" },
            status:                 { roles: ["responsible"], description: "The status of the account" },
            tel_cell:               { roles: ["responsible"], description: "The cell phone number of the account holder" },
            tel_work:               { roles: ["responsible"], description: "The work phone number of the account holder" },
            touched_at:             { roles: ["responsible"], description: "The timestamp of when the account was last modified" },
            touched_by:             { roles: ["responsible"], description: "The user who last modified the account" },
        }
    },
    post: {
        properties: {
            id:                     { roles: ["responsible"],
            adr_city:               { roles: ["responsible"], description: "The city of the account holder's address" },
            adr_street:             { roles: ["responsible"], description: "The street of the account holder's address" },
            adr_zip:                { roles: ["responsible"], description: "The zip code of the account holder's address" },
            email:                  { roles: ["responsible"], description: "The email address of the account holder" },
            n_first:                { roles: ["responsible"], description: "The first name of the account holder" },
            n_last:                 { roles: ["responsible"], description: "The last name of the account holder" },
            place_id:               { roles: ["responsible"], description: "The ID of the place associated with the account" },
            revenue:                { roles: ["responsible"], description: "The revenue of the account" },
            status:                 { roles: ["responsible"], description: "The status of the account" },
            tel_cell:               { roles: ["responsible"], description: "The cell phone number of the account holder" },
            tel_work:               { roles: ["responsible"], description: "The work phone number of the account holder" },
        }
    },
    delete: {},
}

module.exports = acl_account