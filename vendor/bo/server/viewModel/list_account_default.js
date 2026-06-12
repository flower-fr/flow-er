module.exports = {
    params: { 
        order: { touched_at: "desc" },
    },
    properties: {
        n_fn: {
            type: "input",
            label: {
                "default": "Name",
                "fr_FR": "Nom"
            },
            anchor: true,
        },

        email: {
            type: "email",
            label: {
                "default": "Email",
                "fr_FR": "E-mail"
            },
            anchor: true,
        },

        tel_cell: {
            type: "phone",
            label: {
                "default": "Cell phone",
                "fr_FR": "Téléphone portable"
            },
            anchor: true,
        },
    },
    identifier: "n_fn",
    translations: {
        "Add": "Ajouter",
        "Check all": "Tout sélectionner",
        "Display the entire list": "Afficher la liste complète",
        "Grouped actions": "Actions groupées",
        "New": "Nouveau client",
    }
}
