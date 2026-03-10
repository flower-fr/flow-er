const demoContent = [
    {
        identifier: "header",
        level: 0,
        parent: null,
        before: null,
        content: {
            id: 1,
            clients: [
                { id: 1, label: "Client 1 - 25 rue du Faubourg du Temple, 75010 PARIS" },
                { id: 2, label: "Client 2 - xxxxx, xxxxx xxxxx" },
            ],
            name: "Offre commerciale – Solutions IT sur mesure",
            description: "Nous vous remercions pour votre confiance et l’opportunité de vous proposer une offre adaptée à vos besoins en solutions IT.<br>Notre entreprise, spécialisée dans le Service Desk, le développement logiciel, et l’infrastructure IT, vous propose les prestations suivantes",
        },
    },

    {
        identifier: "support_utilisateurs",
        level: 2,
        parent: "0",
        before: null,
        content: {
            name: "A. Support utilisateurs",
            description: "Lorem ipsum..."
        },
    },
    
    {
        identifier: "support_niveau_1",
        level: 3,
        parent: "1",
        before: null,
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
        level: 3,
        parent: "1",
        before: "2",
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
        level: 3,
        parent: "1",
        before: "3",
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
        level: 2,
        parent: "0",
        before: "1",
        content: {
            name: "B. Développement logiciel",
            description: "Lorem ipsum..."
        },
    },
    {
        identifier: "application_web_sur_mesure",
        level: 3,
        parent: "4",
        before: null,
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
        level: 3,
        parent: "4",
        before: "5",
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
        level: 3,
        parent: "4",
        before: "6",
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
        level: 2,
        parent: "0",
        before: "4",
        content: {
            name: "C. Infrastructure IT",
            description: "Lorem ipsum..."
        },
    },
    {
        identifier: "audit_securite",
        level: 3,
        parent: "8",
        before: null,
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
        level: 3,
        parent: "8",
        before: "9",
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
        level: 3,
        parent: "8",
        before: "10",
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
        level: 2,
        parent: "0",
        before: "8",
        content: {
            name: "D. Virtualisation et sécurisation du poste de travail",
            description: "Lorem ipsum..."
        },
    },
    {
        identifier: "virtualisation_vm",
        level: 3,
        parent: "12",
        before: null,
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
        level: 3,
        parent: "12",
        before: "13",
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
        level: 3,
        parent: "12",
        before: "14",
        content: {
            section: "virtualisation_securisation_poste_travail",
            type: "Licences par an",
            name: "Antivirus Entreprise",
            price: 30,
            unit: "Licence annuelle",
            description: "Protection avancée contre les malwares et ransomwares (Bitdefender/Kaspersky).",
        },
    },
    {
        identifier: "sauvegardes_automatiques",
        level: 3,
        parent: "12",
        before: "15",
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
        level: 3,
        parent: "12",
        before: "16",
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
        level: 1,
        parent: 0,
        before: null,
        content: {
            name: "DÉMARRAGE",
            description: "Lorem ipsum...",
            currentPrice: 0,
            clientValue: "computed",
        },
    },
    {
        identifier: "intermediaire",
        level: 1,
        parent: 0,
        before: "18",
        content: {
            name: "INTERMÉDIAIRE",
            description: "Lorem ipsum...",
            currentPrice: 0,
            clientValue: "computed",
        },
    },
    {
        identifier: "complet",
        level: 1,
        parent: 0,
        before: "19",
        content: {
            name: "COMPLET",
            description: "Lorem ipsum...",
            currentPrice: null,
            clientValue: "computed",
        },
    },

    {
        identifier: "1",
        level: 4,
        parent: "18,2",
        before: null,
        content: {
            value: 3,
        },
    },
    {
        identifier: "2",
        level: 4,
        parent: "19,2",
        before: null,
        content: {
            value: 3,
        },
    },
    {
        identifier: "3",
        level: 4,
        parent: "20,2",
        before: null,
        content: {
            value: 3,
        },
    },
    {
        identifier: "4",
        level: 4,
        parent: "19,3",
        before: null,
        content: {
            value: 3,
        },
    },
    {
        identifier: "5",
        level: 4,
        parent: "20,3",
        before: null,
        content: {
            value: 3,
        },
    },
    {
        identifier: "6",
        level: 4,
        parent: "20,4",
        before: null,
        content: {
            value: true,
        },
    },
    {
        identifier: "7",
        level: 4,
        parent: null,
        before: null,
        content: {
            value: true,
        },
    },
    {
        identifier: "8",
        level: 4,
        parent: null,
        before: null,
        content: {
            value: 12,
        },
    },
    {
        identifier: "9",
        level: 4,
        parent: null,
        before: null,
        content: {
            value: 12,
        },
    },
    {
        identifier: "10",
        level: 4,
        parent: null,
        before: null,
        content: {
            value: true,
        },
    },
    {
        identifier: "11",
        level: 4,
        parent: null,
        before: null,
        content: {
            value: true,
        },
    },
    {
        identifier: "12",
        level: 4,
        parent: null,
        before: null,
        content: {
            value: true,
        },
    },
    {
        identifier: "13",
        level: 4,
        parent: null,
        before: null,
        content: {
            value: true,
        },
    },
    {
        identifier: "14",
        level: 4,
        parent: null,
        before: null,
        content: {
            value: true,
        },
    },
    {
        identifier: "15",
        level: 4,
        parent: null,
        before: null,
        content: {
            value: 12,
        },
    },
    {
        identifier: "16",
        level: 4,
        parent: null,
        before: null,
        content: {
            value: 12,
        },
    },
    {
        identifier: "17",
        level: 4,
        parent: null,
        before: null,
        content: {
            value: 12,
        },
    },
    {
        identifier: "18",
        level: 4,
        parent: null,
        before: null,
        content: {
            value: 3,
        },
    },
    {
        identifier: "19",
        level: 4,
        parent: null,
        before: null,
        content: {
            value: 6,
        },
    },
    {
        identifier: "20",
        level: 4,
        parent: null,
        before: null,
        content: {
            value: 9,
        },
    },
    {
        identifier: "21",
        level: 4,
        parent: null,
        before: null,
        content: {
            value: true,
        },
    },
    {
        identifier: "22",
        level: 4,
        parent: null,
        before: null,
        content: {
            value: 3,
        },
    },
    {
        identifier: "23",
        level: 4,
        parent: null,
        before: null,
        content: {
            value: 6,
        },
    },
    {
        identifier: "24",
        level: 4,
        parent: null,
        before: null,
        content: {
            value: 9,
        },
    },
    {
        identifier: "25",
        level: 4,
        parent: null,
        before: null,
        content: {
            value: 3,
        },
    },
    {
        identifier: "26",
        level: 4,
        parent: null,
        before: null,
        content: {
            value: 6,
        },
    },
    {
        identifier: "27",
        level: 4,
        parent: null,
        before: null,
        content: {
            value: 9,
        },
    },
    {
        identifier: "28",
        level: 4,
        parent: null,
        before: null,
        content: {
            value: true,
        },
    },
]

module.exports = { demoContent }