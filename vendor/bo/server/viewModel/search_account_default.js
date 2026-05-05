module.exports = {
    params: { 
        order: { touched_at: "desc" },
        where: { status: "new" }
    },
    properties: {
        id: {
            type: "input",
            label: {
                "default": "Account ID"
            }
        },

        status: {
            type: "select",
            modalities: {
                new: {
                    label: {
                        "default": "New",
                        "fr_FR": "Nouveau"
                    }
                },
                active: {
                    label: {
                        "default": "Active",
                        "fr_FR": "Actif"
                    }
                }
            },
            label: {
                "default": "Status",
                "fr_FR": "Statut"
            }
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
            label: {
                "default": "Region",
                "fr_FR": "Région"
            }
        },

        place_id: {
            type: "vector",
            entity: "place",
            key: "id",
            format: ["%s (%s)", "name,region"],
            columns: ["id", "name", "region"],
            where: {status: "new"},
            order: { name: "ASC" },
            label: {
                "default": "Place",
                "fr_FR": "Établissement"
            }
        },

        place_name: {
            type: "input",
            label: {
                "default": "Place",
                "fr_FR": "Établissement"
            }
        },

        n_first: {
            type: "input",
            label: {
                "default": "first name",
                "fr_FR": "Prénom"
            }
        },

        n_last: {
            type: "input",
            label: {
                "default": "Last name",
                "fr_FR": "Nom"
                
            }
        },

        email: {
            type: "email",
            label: {
                "default": "Email",
                "fr_FR": "E-mail"
            }
        },

        tel_cell: {
            type: "phone",
            label: {
                "default": "Cell phone",
                "fr_FR": "Téléphone portable"
            }
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
            label: {
                "default": "Tag",
                "fr_FR": "Tag"
            }
        },

        touched_at: {
            type: "datetime",
            label: {
                "default": "Last updated",
                "fr_FR": "Dernière mise à jour"
            }
        },
    },
    translations: {
        mdbDateFormat: "dd/mm/yyyy",
        mdbMonthsFull: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"],
        mdbWeekdaysNarrow: ["D", "L", "M", "M", "J", "V", "S"],
        "Erase": "Effacer",
        "Refresh the list": "Actualiser la liste",
    }
}
