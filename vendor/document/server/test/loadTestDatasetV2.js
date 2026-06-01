const { version } = require("pdfkit")

const demoContent = {
    document: {
        type: "structured",
        folder: "Tests",
        name: "Test dataset v2",
        mime: "application/json",
        version: "1",
    },
    cells: [
        {
            identifier: "header",
            level: 0,
            parent: null,
            predecessor: null,
            content: {
                reference: "DEVIS-2026-001",
                date: "2024-06-01",
                client_id: 1,
                name: "Offre commerciale – Solutions IT sur mesure",
                description: "Nous vous remercions pour votre confiance et l’opportunité de vous proposer une offre adaptée à vos besoins en solutions IT.<br>Notre entreprise, spécialisée dans le Service Desk, le développement logiciel, et l’infrastructure IT, vous propose les prestations suivantes",
                clients: [
                    { id: 1, label: "Client 1 - 25 rue du Faubourg du Temple, 75010 PARIS" },
                    { id: 2, label: "Client 2 - xxxxx, xxxxx xxxxx" },
                ],
            },
        },

        {
            identifier: "support_utilisateurs",
            level: 1,
            parent: "header",
            predecessor: null,
            content: {
                name: "A. Support utilisateurs",
                description: "Lorem ipsum..."
            },
        },
        {
            identifier: "support_niveau_1",
            level: 2,
            parent: "support_utilisateurs",
            predecessor: null,
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
            identifier: "support_niveau_2",
            level: 2,
            parent: "support_utilisateurs",
            predecessor: "support_niveau_1",
            content: {
                section: "support_utilisateurs",
                type: "Utilisateur x mois",
                name: "Support Niveau 2",
                price: 80,
                unit: "Utilisateur x mois",
                description: "Résolution avancée (escalade, diagnostics) – 8h/5j",
            },
        },
        {
            identifier: "support_24_7",
            level: 2,
            parent: "support_utilisateurs",
            predecessor: "support_niveau_2",
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

        {
            identifier: "developpement_logiciel",
            level: 1,
            parent: "header",
            predecessor: "support_utilisateurs",
            content: {
                name: "B. Développement logiciel",
                description: "Lorem ipsum..."
            },
        },
        {
            identifier: "application_web_sur_mesure",
            level: 2,
            parent: "developpement_logiciel",
            predecessor: null,
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
            identifier: "maintenance_evolutive",
            level: 2,
            parent: "developpement_logiciel",
            predecessor: "application_web_sur_mesure",
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
            identifier: "hebergement",
            level: 2,
            parent: "developpement_logiciel",
            predecessor: "maintenance_evolutive",
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
            identifier: "infrastructure_it",
            level: 1,
            parent: "header",
            predecessor: "developpement_logiciel",
            content: {
                name: "C. Infrastructure IT",
                description: "Lorem ipsum..."
            },
        },
        {
            identifier: "audit_securite",
            level: 2,
            parent: "infrastructure_it",
            predecessor: null,
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
            identifier: "migration_cloud",
            level: 2,
            parent: "infrastructure_it",
            predecessor: "audit_securite",
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
            identifier: "sauvegarde",
            level: 2,
            parent: "infrastructure_it",
            predecessor: "migration_cloud",
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
            identifier: "virtualisation_securisation_poste_travail",
            level: 1,
            parent: "header",
            predecessor: "infrastructure_it",
            content: {
                name: "D. Virtualisation et sécurisation du poste de travail",
                description: "Lorem ipsum..."
            },
        },
        {
            identifier: "virtualisation_vm",
            level: 2,
            parent: "virtualisation_securisation_poste_travail",
            predecessor: null,
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
            identifier: "stockage_nas",
            level: 2,
            parent: "virtualisation_securisation_poste_travail",
            predecessor: "virtualisation_vm",
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
            identifier: "antivirus_entreprise",
            level: 2,
            parent: "virtualisation_securisation_poste_travail",
            predecessor: "stockage_nas",
            content: {
                section: "virtualisation_securisation_poste_travail",
                type: "Licences par an",
                name: "Sécurité défensive : EDR",
                price: 30,
                unit: "Licence annuelle",
                description: "Protection avancée contre les malwares et ransomwares (Bitdefender/Kaspersky).",
            },
        },
        {
            identifier: "filtrage_dns",
            level: 2,
            parent: "virtualisation_securisation_poste_travail",
            predecessor: "antivirus_entreprise",
            content: {
                section: "virtualisation_securisation_poste_travail",
                type: "check",
                name: "Sécurité défensive : Filtrage DNS",
                lockedTo: "antivirus_entreprise",
                price: 25,
                unit: "Forfait",
                description: "Ce produit est obligatoirement associé au produit Sécurité défensive : EDR",
            },
        },
        {
            identifier: "sauvegardes_automatiques",
            level: 2,
            parent: "virtualisation_securisation_poste_travail",
            predecessor: "filtrage_dns",
            content: {
                section: "virtualisation_securisation_poste_travail",
                type: "Par an",
                name: "Sauvegardes automatiques",
                price: 400,
                unit: "Annuelle",
                description: "Solution de sauvegarde incrémentielle et chiffrée (Veeam/BackupPC) sur site ou cloud.",
            },
        },
        {
            identifier: "chiffrement_donnees",
            level: 2,
            parent: "virtualisation_securisation_poste_travail",
            predecessor: "sauvegardes_automatiques",
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

        {
            identifier: "demarrage",
            level: 3,
            parent: "header",
            predecessor: null,
            // cells: [1][*],
            content: {
                name: "DÉMARRAGE",
                description: "Lorem ipsum...",
                currentPrice: 0,
                clientValue: "computed",
            },
        },
        {
            identifier: "intermediaire",
            level: 3,
            parent: "header",
            predecessor: "demarrage",
            // cells: [1][*],
            content: {
                name: "INTERMÉDIAIRE",
                description: "Lorem ipsum...",
                currentPrice: 0,
                clientValue: "computed",
            },
        },
        {
            identifier: "complet",
            level: 3,
            parent: "header",
            predecessor: "intermediaire",
            // cells: [1][*],
            content: {
                name: "COMPLET",
                description: "Lorem ipsum...",
                currentPrice: null,
                clientValue: "computed",
            },
        },

        // { // Cellule de ligne groupe
        //     level: 4,
        //     parent: "demarrage,support_utilisateurs",
        //     cells: [2][*],
        // },
        {
            identifier: "1",
            level: 4,
            parent: "demarrage,support_niveau_1",
            // cells: [2][*],
            content: {
                value: 3,
            },
        },
        {
            identifier: "2",
            level: 4,
            parent: "intermediaire,support_niveau_1",
            content: {
                value: 3,
            },
        },
        {
            identifier: "3",
            level: 4,
            parent: "complet,support_niveau_1",
            content: {
                value: 3,
            },
        },
        {
            identifier: "4",
            level: 4,
            parent: "intermediaire,support_niveau_2",
            content: {
                value: 3,
            },
        },
        {
            identifier: "5",
            level: 4,
            parent: "complet,support_niveau_2",
            content: {
                value: 3,
            },
        },
        {
            identifier: "6",
            level: 4,
            parent: "complet,support_24_7",
            content: {
                value: true,
            },
        },
        {
            identifier: "7",
            level: 4,
            parent: "complet,application_web_sur_mesure",
            content: {
                value: true,
            },
        },
        {
            identifier: "8",
            level: 4,
            parent: "complet,maintenance_evolutive",
            content: {
                value: 12,
            },
        },
        {
            identifier: "9",
            level: 4,
            parent: "complet,hebergement",
            content: {
                value: 12,
            },
        },
        {
            identifier: "10",
            level: 4,
            parent: "demarrage,audit_securite",
            content: {
                value: true,
            },
        },
        {
            identifier: "11",
            level: 4,
            parent: "intermediaire,audit_securite",
            content: {
                value: true,
            },
        },
        {
            identifier: "12",
            level: 4,
            parent: "complet,audit_securite",
            content: {
                value: true,
            },
        },
        {
            identifier: "13",
            level: 4,
            parent: "intermediaire,migration_cloud",
            content: {
                value: true,
            },
        },
        {
            identifier: "14",
            level: 4,
            parent: "complet,migration_cloud",
            content: {
                value: true,
            },
        },
        {
            identifier: "15",
            level: 4,
            parent: "demarrage,sauvegarde",
            content: {
                value: 12,
            },
        },
        {
            identifier: "16",
            level: 4,
            parent: "intermediaire,sauvegarde",
            content: {
                value: 12,
            },
        },
        {
            identifier: "17",
            level: 4,
            parent: "complet,sauvegarde",
            content: {
                value: 12,
            },
        },
        {
            identifier: "18",
            level: 4,
            parent: "demarrage,virtualisation_vm",
            content: {
                value: 3,
            },
        },
        {
            identifier: "19",
            level: 4,
            parent: "intermediaire,virtualisation_vm",
            content: {
                value: 6,
            },
        },
        {
            identifier: "20",
            level: 4,
            parent: "complet,virtualisation_vm",
            content: {
                value: 9,
            },
        },
        {
            identifier: "21",
            level: 4,
            parent: "complet,stockage_nas",
            content: {
                value: true,
            },
        },
        {
            identifier: "22",
            level: 4,
            parent: "demarrage,antivirus_entreprise",
            content: {
                value: 3,
            },
        },
        {
            identifier: "29",
            level: 4,
            parent: "demarrage,filtrage_dns",
            content: {
                value: 3,
            },
        },
        {
            identifier: "23",
            level: 4,
            parent: "intermediaire,antivirus_entreprise",
            content: {
                value: 6,
            },
        },
        {
            identifier: "30",
            level: 4,
            parent: "intermediaire,filtrage_dns",
            content: {
                value: 6,
            },
        },
        {
            identifier: "24",
            level: 4,
            parent: "complet,antivirus_entreprise",
            content: {
                value: 9,
            },
        },
        {
            identifier: "31",
            level: 4,
            parent: "complet,filtrage_dns",
            content: {
                value: 9,
            },
        },
        {
            identifier: "25",
            level: 4,
            parent: "demarrage,sauvegardes_automatiques",
            content: {
                value: 3,
            },
        },
        {
            identifier: "26",
            level: 4,
            parent: "intermediaire,sauvegardes_automatiques",
            content: {
                value: 6,
            },
        },
        {
            identifier: "27",
            level: 4,
            parent: "complet,sauvegardes_automatiques",
            content: {
                value: 9,
            },
        },
        {
            identifier: "28",
            level: 4,
            parent: "complet,chiffrement_donnees",
            content: {
                value: true,
            },
        },
    ]
}

module.exports = { demoContent }