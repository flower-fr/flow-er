module.exports = {
    properties: {
        n_first: {
            type: "input",
            label: "Prénom",
        },
        n_last: {
            type: "input",
            label: "Nom",
        },
        business_name: {
            type: "input",
            label: "Entreprise",
            required: true,
        },
        email: {
            type: "email",
            label: "Email",
            required: true,
        },
        tel_work: {
            type: "phone",
            label: "Téléphone professionnel",
        },
    },
    translations: {
        "Cancel": "Annuler",
        "DD/MM/YYYY": "JJ/MM/AAAA",
        "Request registered": "Demande enregistrée",
        "Technical error, Please try again later": "Erreur technique, veuillez ré-éssayer ultérieurement",
        "The data already exists": "La donnée existe déjà",
    }
}
