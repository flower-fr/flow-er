module.exports = {
    properties: {
        status: {
            type: "select",
            modalities: {
                new: {
                    label: "Nouveau",
                },
                active: {
                    label: "Actif",
                }
            },
            label: "Statut"
        },

        place_region: {
            type: "select",
            modalities: {
                auvergne_rhone_alpes: {
                    label: "Auvergne-Rhône-Alpes"
                },
                bourgogne_franche_comte: {
                    label: "Bourgogne-Franche-Comté"
                },
                bretagne: {
                    label: "Bretagne"
                },
                centre_val_de_loire: {
                    label: "Centre-Val de Loire"
                },
                corse: {
                    label: "Corse"
                },
                grand_est: {
                    label: "Grand Est"
                },
                guadeloupe: {
                    label: "Guadeloupe"
                },
                guyane: {
                    label: "Guyane"
                },
                hauts_de_france: {
                    label: "Hauts-de-France"
                },
                ile_de_france: {
                    label: "Île-de-France"
                },
                la_reunion: {
                    label: "La Réunion"
                },
                martinique: {
                    label: "Martinique"
                },
                mayotte: {
                    label: "Mayotte"
                },
                normandie: {
                    label: "Normandie"
                },
                nouvelle_aquitaine: {
                    label: "Nouvelle-Aquitaine"
                },
                occitanie: {
                    label: "Occitanie"
                },
                pays_de_la_loire: {
                    label: "Pays de la Loire"
                },
                provence_alpes_cote_d_azur: {
                    label: "Provence-Alpes-Côte d'Azur"
                }
            },
            label: "Région"
        },

        place_name: {
            type: "input",
            label: "Établissement"
        },

        n_fn: {
            type: "input",
            label: "Nom"
        },

        email: {
            type: "email",
            label: "Email"
        },

        tel_cell: {
            type: "phone",
            label: "Téléphone portable"
        },

        touched_at: {
            type: "datetime",
            label: "Dernière mise à jour"
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
