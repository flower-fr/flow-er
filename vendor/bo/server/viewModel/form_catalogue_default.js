module.exports = {
    properties: {
        identifier: {
            type: "input",
            label: "Référence",
            required: true,
        },
        type: {
            type: "input",
            label: "Type",
        },
        supplier_reference: {
            type: "input",
            label: "Référence fournisseur",
        },
        description: {
            type: "textarea",
            label: "Description",
            required: true,
        },
        unit_price: {
            type: "number",
            label: "Prix unitaire",
        },
        tax_rate: {
            type: "percentage",
            label: "Taux de TVA",
        },
    },
    posts: {
        add: {
            method: "POST",
            controller: "core",
            action: "v1",
            entity: "crm_catalogue",
            label: "Ajouter",
        }
    },
    translations: {
        "DD/MM/YYYY": "JJ/MM/AAAA",
        "Technical error, pLease try again later": "Erreur technique, veuillez ré-éssayer ultérieurement",
        "Request registered": "Demande enregistrée",
        "The data has changed in the meantime, please input again": "La donnée a été modifiée entretemps, veuillez saisir à nouveau",
        "The data already exists": "La donnée existe déjà",
    }
}