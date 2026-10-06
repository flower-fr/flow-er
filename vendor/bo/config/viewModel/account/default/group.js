module.exports = {
    tabs: {
        update: {
            form: ["status"],
            post: {
                method: "POST",
                controller: "core",
                action: "v1",
                entity: "account",
                body: {
                    rows: {
                        id: "matchingRow",
                        status: "form",
                    }
                },
                label: "Modifier",
            },
        },
        delete: {
            post: {
                method: "DELETE",
                controller: "core",
                action: "v1",
                entity: "account",
                label: "Supprimer",
                class: "danger",
            },
        },
    },
    properties: {
        id: {
            type: "input",
        },
        status: {
            type: "select",
            label: "Statut",
            modalities: {
                suspect: {
                    label: "Suspect"
                },
                new: {
                    label: "Prise de contact"
                },
                appointment: {
                    label: "Rendez-vous"
                },
                proposal: {
                    label: "Proposition"
                },
                relance: {
                    label: "Relance"
                },
                active: {
                    label: "Contrat"
                },
                gone: {
                    label: "Parti"
                }
            },
        },
        // callback_date: {
        //     type: "date",
        //     label: "Date de rappel",
        // },
    },
    translations: {
        "Cancel": "Annuler",
        "DD/MM/YYYY": "JJ/MM/AAAA",
        "Error": "Erreur",
        "Request registered": "Demande enregistrée",
        "Technical error, Please try again later": "Erreur technique, veuillez ré-éssayer ultérieurement",
        "The data has changed in the meantime, please input again": "La donnée a été modifiée entretemps, veuillez saisir à nouveau",
        "The data already exists": "La donnée existe déjà",
    }
}
