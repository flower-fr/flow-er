const denormalizeDocument = (cells) => {
    cells
    return [
        [
            {
                id: 0,
                identifier: "header",
                level: 0,
                parent: null,
                previous: null,
                content: {
                    id: 1,
                    clients: [
                        { id: 1, label: "Client 1 - 25 rue du Faubourg du Temple, 75010 PARIS" },
                        { id: 2, label: "Client 2 - xxxxx, xxxxx xxxxx" },
                    ],
                    name: "Offre commerciale – Solutions IT sur mesure",
                    description: "Nous vous remercions pour votre confiance et l’opportunité de vous proposer une offre adaptée à vos besoins en solutions IT.<br>Notre entreprise, spécialisée dans le Service Desk, le développement logiciel, et l’infrastructure IT, vous propose les prestations suivantes",
                },
            }
        ],
        [
            {},
            {},
            {
                id: 19,
                identifier: "demarrage",
                level: 1,
                parent: 0,
                previous: null,
                content: {
                    name: "DÉMARRAGE",
                    description: "Lorem ipsum...",
                    currentPrice: 0,
                    clientValue: "computed",
                },
            },
            {
                id: 20,
                identifier: "intermediaire",
                level: 1,
                parent: 0,
                previous: "19",
                content: {
                    name: "INTERMÉDIAIRE",
                    description: "Lorem ipsum...",
                    currentPrice: 0,
                    clientValue: "computed",
                },
            },
            {
                id: 21,
                identifier: "complet",
                level: 1,
                parent: 0,
                previous: "20",
                content: {
                    name: "COMPLET",
                    description: "Lorem ipsum...",
                    currentPrice: null,
                    clientValue: "computed",
                },
            }
        ],
        [
            {
                id: 1,
                identifier: "support_utilisateurs",
                level: 2,
                parent: "0",
                previous: null,
                content: {
                    name: "A. Support utilisateurs",
                    description: "Lorem ipsum..."
                },
            },
            {},
            {},
            {},
            {}
        ],
        [
            {},
            {
                id: 2,
                identifier: "support_niveau_1",
                level: 3,
                parent: "1",
                previous: null,
                content: {
                    section: "support_utilisateurs",
                    type: "Utilisateur x mois",
                    name: "Support Niveau 1",
                    description: "Assistance technique (tickets, appels, emails) – 8h/5j",
                    price: 50,
                    unit: "Utilisateur x mois",
                },
            },
            {
                identifier: "1",
                level: 4,
                parent: "19,2",
                previous: null,
                content: {
                    value: 3,
                },
            },
            {
                identifier: "2",
                level: 4,
                parent: "20,2",
                previous: null,
                content: {
                    value: 3,
                },
            },
            {
                identifier: "3",
                level: 4,
                parent: "21,2",
                previous: null,
                content: {
                    value: 3,
                },
            }
        ],
        [
            {},
            {
                id: 3,
                identifier: "support_niveau_2",
                level: 3,
                parent: "1",
                previous: "2",
                content: {
                    section: "support_utilisateurs",
                    type: "Utilisateur x mois",
                    name: "Support Niveau 2",
                    price: 80,
                    unit: "Utilisateur x mois",
                    description: "Résolution avancée (escalade, diagnostics) – 8h/5j",
                },
            },
            {},
            {
                identifier: "4",
                level: 4,
                parent: "20,3",
                previous: null,
                content: {
                    value: 3,
                },
            },
            {
                identifier: "5",
                level: 4,
                parent: "21,3",
                previous: null,
                content: {
                    value: 3,
                },
            }
        ],
        [
            {},
            {
                id: 4,
                identifier: "support_24_7",
                level: 3,
                parent: "1",
                previous: "3",
                content: {
                    section: "support_utilisateurs",
                    type: "check",
                    name: "OPTION Support 24/7",
                    price: 1000,
                    unit: "Forfait",
                    adjustable: true,
                    description: "Disponibilité étendue (soirs, week-ends, jours fériés)",
                },
            },
            {},
            {},
            {
                identifier: "6",
                level: 4,
                parent: "21,4",
                previous: null,
                content: {
                    value: true,
                },
            }
        ],
        [
            {
                id: 5,
                identifier: "developpement_logiciel",
                level: 2,
                parent: "0",
                previous: "1",
                content: {
                    name: "B. Développement logiciel",
                    description: "Lorem ipsum..."
                },
            },
            {},
            {},
            {},
            {}
        ],
        [
            {},
            {
                id: 6,
                identifier: "application_web_sur_mesure",
                level: 3,
                parent: "4",
                previous: null,
                content: {
                    section: "developpement_logiciel",
                    type: "check",
                    name: "Application web sur mesure",
                    price: 15000,
                    unit: "Forfait",
                    description: "Développement d’une application métiers (back-end + front-end)",
                },
            },
            {
                identifier: "7",
                level: 4,
                parent: "19,6",
                previous: null,
                content: {
                    value: true,
                },
            },
            {
                identifier: "8",
                level: 4,
                parent: "20,6",
                previous: null,
                content: {
                    value: 12,
                },
            },
            {
                identifier: "9",
                level: 4,
                parent: "21,6",
                previous: null,
                content: {
                    value: 12,
                },
            }
        ],
        [
            {},
            {
                id: 7,
                identifier: "maintenance_evolutive",
                level: 3,
                parent: "4",
                previous: "5",
                content: {
                    section: "developpement_logiciel",
                    type: "Mois",
                    name: "Maintenance évolutive",
                    price: 1500,
                    unit: "Mois",
                    description: "Mises à jour, correctifs, ajout de fonctionnalités (10h/mois)",
                },
            },
            {
                identifier: "10",
                level: 4,
                parent: "19,7",
                previous: null,
                content: {
                    value: true,
                },
            },
            {
                identifier: "11",
                level: 4,
                parent: "20,7",
                previous: null,
                content: {
                    value: true,
                },
            },
            {
                identifier: "12",
                level: 4,
                parent: "21,7",
                previous: null,
                content: {
                    value: true,
                },
            }
        ],
        [
            {},
            {
                id: 8,
                identifier: "hebergement",
                level: 3,
                parent: "4",
                previous: "6",
                content: {
                    section: "developpement_logiciel",
                    type: "Mois",
                    name: "OPTION Hébergement",
                    price: 300,
                    unit: "Mois",
                    adjustable: true,
                    description: "Hébergement cloud sécurisé (AWS/Azure) + sauvegardes automatiques",
                },
            },
            {
                identifier: "13",
                level: 4,
                parent: "19,8",
                previous: null,
                content: {
                    value: true,
                },
            },
            {
                identifier: "14",
                level: 4,
                parent: "20,8",
                previous: null,
                content: {
                    value: true,
                },
            },
            {
                identifier: "15",
                level: 4,
                parent: "21,8",
                previous: null,
                content: {
                    value: 12,
                },
            }
        ],
        [
            {
                id: 9,
                identifier: "infrastructure_it",
                level: 2,
                parent: "0",
                previous: "4",
                content: {
                    name: "C. Infrastructure IT",
                    description: "Lorem ipsum..."
                },
            },
            {},
            {},
            {},
            {}
        ],
        [
            {},
            {
                id: 10,
                identifier: "audit_securite",
                level: 3,
                parent: "8",
                previous: null,
                content: {
                    section: "infrastructure_it",
                    type: "check",
                    name: "Audit sécurité",
                    price: 2500,
                    unit: "Forfait",
                    description: "Analyse des vulnérabilités et recommandations",
                },
            },
            {
                identifier: "16",
                level: 4,
                parent: "19,10",
                previous: null,
                content: {
                    value: 12,
                },
            },
            {
                identifier: "17",
                level: 4,
                parent: "20,10",
                previous: null,
                content: {
                    value: 12,
                },
            },
            {
                identifier: "18",
                level: 4,
                parent: "21,10",
                previous: null,
                content: {
                    value: 3,
                },
            }
        ],
        [
            {},
            {
                id: 11,
                identifier: "migration_cloud",
                level: 3,
                parent: "8",
                previous: "9",
                content: {
                    section: "infrastructure_it",
                    type: "check",
                    name: "Migration vers le cloud",
                    price: 2500,
                    unit: "Forfait",
                    description: "Migration des serveurs locaux vers une solution cloud (Azure/AWS)",
                },
            },
            {
                identifier: "19",
                level: 4,
                parent: "19,11",
                previous: null,
                content: {
                    value: 6,
                },
            },
            {
                identifier: "20",
                level: 4,
                parent: "20,11",
                previous: null,
                content: {
                    value: 9,
                },
            },
            {
                identifier: "21",
                level: 4,
                parent: "21,11",
                previous: null,
                content: {
                    value: true,
                },
            }
        ],
        [
            {},
            {
                id: 12,
                identifier: "sauvegarde",
                level: 3,
                parent: "8",
                previous: "10",
                content: {
                    section: "infrastructure_it",
                    type: "Mois",
                    name: "OPTION Sauvegarde",
                    price: 200,
                    unit: "Mois",
                    adjustable: true,
                    description: "Solution de sauvegarde externalisée (1To de stockage)",
                },
            },
            {
                identifier: "22",
                level: 4,
                parent: "19,12",
                previous: null,
                content: {
                    value: 3,
                },
            },
            {
                identifier: "23",
                level: 4,
                parent: "20,12",
                previous: null,
                content: {
                    value: 6,
                },
            },
            {
                identifier: "24",
                level: 4,
                parent: "21,12",
                previous: null,
                content: {
                    value: 9,
                },
            }
        ],
        [
            {
                id: 13,
                identifier: "virtualisation_securisation_poste_travail",
                level: 2,
                parent: "0",
                previous: "8",
                content: {
                    name: "D. Virtualisation et sécurisation du poste de travail",
                    description: "Lorem ipsum..."
                },
            },
            {},
            {},
            {},
            {}
        ],
        [
            {},
            {
                id: 14,
                identifier: "virtualisation_vm",
                level: 3,
                parent: "12",
                previous: null,
                content: {
                    section: "virtualisation_securisation_poste_travail",
                    type: "VM",
                    name: "Virtualisation (VM)",
                    price: 200,
                    unit: "VM",
                    description: "Mise en place de machines virtuelles (VMware/Proxmox)",
                },
            },
            {
                identifier: "25",
                level: 4,
                parent: "19,14",
                previous: null,
                content: {
                    value: 3,
                },
            },
            {
                identifier: "26",
                level: 4,
                parent: "20,14",
                previous: null,
                content: {
                    value: 6,
                },
            },
            {
                identifier: "27",
                level: 4,
                parent: "21,14",
                previous: null,
                content: {
                    value: 9,
                },
            }
        ],
        [
            {},
            {
                id: 15,
                identifier: "stockage_nas",
                level: 3,
                parent: "12",
                previous: "13",
                content: {
                    section: "virtualisation_securisation_poste_travail",
                    type: "check",
                    name: "Stockage NAS",
                    price: 1500,
                    unit: "NAS",
                    description: "Solution de stockage réseau sécurisé (Synology/QNAP) avec 10 To de capacité.",
                },
            },
            {
                identifier: "28",
                level: 4,
                parent: "19,15",
                previous: null,
                content: {
                    value: true,
                },
            },
            {},
            {}
        ],
        [
            {},
            {
                id: 16,
                identifier: "antivirus_entreprise",
                level: 3,
                parent: "12",
                previous: "14",
                content: {
                    section: "virtualisation_securisation_poste_travail",
                    type: "Licences par an",
                    name: "Antivirus Entreprise",
                    price: 30,
                    unit: "Licence annuelle",
                    description: "Protection avancée contre les malwares et ransomwares (Bitdefender/Kaspersky).",
                },
            },
            {},
            {},
            {}
        ],
        [
            {},
            {
                id: 17,
                identifier: "sauvegardes_automatiques",
                level: 3,
                parent: "12",
                previous: "15",
                content: {
                    section: "virtualisation_securisation_poste_travail",
                    type: "Par an",
                    name: "Sauvegardes automatiques",
                    price: 400,
                    unit: "Annuelle",
                    description: "Solution de sauvegarde incrémentielle et chiffrée (Veeam/BackupPC) sur site ou cloud.",
                },
            },
            {},
            {},
            {}
        ],
        [
            {},
            {
                id: 18,
                identifier: "chiffrement_donnees",
                level: 3,
                parent: "12",
                previous: "16",
                content: {
                    section: "virtualisation_securisation_poste_travail",
                    type: "check",
                    name: "OPTION Chiffrement des données",
                    price: 800,
                    unit: "Forfait",
                    adjustable: true,
                    description: "Chiffrement complet des postes de travail et des sauvegardes (BitLocker/Veracrypt).",
                },
            },
            {},
            {},
            {}
        ],
    ]
}

export default denormalizeDocument