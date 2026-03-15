module.exports = {
    properties: {
        id: {
            type: "input",
            label: "Account ID"
        },

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

        place_id: {
            type: "vector",
            entity: "place",
            key: "id",
            format: ["%s (%s)", "name,region"],
            columns: ["id", "name", "region"],
            where: {status: "new"},
            order: { name: "ASC" },
            label: "Place"
        },

        place_name: {
            type: "input",
            label: "Établissement"
        },

        n_first: {
            type: "input",
            label: "Prénom"
        },

        n_last: {
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

        tag: {
            type: "vector",
            multiple: true,
            entity: "tag",
            key: "id",
            format: ["%s", "name"],
            columns: ["id", "name"],
            where: {status: "new"},
            order: { name: "ASC" },
            label: "Tag"
        },
    },
    translations: {
        "Refresh the list": "Actualiser la liste",
        "Erase": "Effacer",
    }
}
