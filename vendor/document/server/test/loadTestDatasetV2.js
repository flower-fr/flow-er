const demoContent = [
    {
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
    },

    {
        level: 2,
        parent: "0",
        previous: null,
        content: {
            name: "A. Support utilisateurs",
            description: "Lorem ipsum..."
        },
    },
    
    {
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
        level: 3,
        parent: "1",
        previous: 2,
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
        level: 3,
        parent: "1",
        previous: 3,
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
        level: 2,
        parent: "0",
        previous: 1,
        content: {
            name: "B. Développement logiciel",
            description: "Lorem ipsum..."
        },
    },
    {
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
        level: 3,
        parent: "4",
        previous: 5,
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
        level: 3,
        parent: "4",
        previous: 6,
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
        level: 2,
        parent: "0",
        previous: 4,
        content: {
            name: "C. Infrastructure IT",
            description: "Lorem ipsum..."
        },
    },
    {
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
        level: 3,
        parent: "8",
        previous: 9,
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
        level: 3,
        parent: "8",
        previous: 10,
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
        level: 2,
        parent: "0",
        previous: 8,
        content: {
            name: "D. Virtualisation et sécurisation du poste de travail",
            description: "Lorem ipsum..."
        },
    },
    {
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
        level: 3,
        parent: "12",
        previous: 13,
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
        level: 3,
        parent: "12",
        previous: 14,
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
        level: 3,
        parent: "12",
        previous: 15,
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
        level: 3,
        parent: "12",
        previous: 16,
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
        level: 1,
        parent: "0",
        previous: null,
        content: {
            name: "DÉMARRAGE",
            description: "Lorem ipsum...",
            currentPrice: 0,
            clientValue: "computed",
        },
    },
    {
        level: 1,
        parent: "0",
        previous: 18,
        content: {
            name: "INTERMÉDIAIRE",
            description: "Lorem ipsum...",
            currentPrice: 0,
            clientValue: "computed",
        },
    },
    {
        level: 1,
        parent: "0",
        previous: 19,
        content: {
            name: "COMPLET",
            description: "Lorem ipsum...",
            currentPrice: null,
            clientValue: "computed",
        },
    },

    {
        level: 4,
        parent: "18,2",
        previous: null,
        content: {
            value: 3,
        },
    },
    {
        level: 4,
        parent: "19,2",
        previous: null,
        content: {
            value: 3,
        },
    },
    {
        level: 4,
        parent: "20,2",
        previous: null,
        content: {
            value: 3,
        },
    },
    {
        level: 4,
        parent: "19,3",
        previous: null,
        content: {
            value: 3,
        },
    },
    {
        level: 4,
        parent: "20,3",
        previous: null,
        content: {
            value: 3,
        },
    },
    {
        level: 4,
        parent: "20,4",
        previous: null,
        content: {
            value: true,
        },
    },
    {
        level: 4,
        parent: null,
        previous: null,
        content: {
            value: true,
        },
    },
    {
        level: 4,
        parent: null,
        previous: null,
        content: {
            value: 12,
        },
    },
    {
        level: 4,
        parent: null,
        previous: null,
        content: {
            value: 12,
        },
    },
    {
        level: 4,
        parent: null,
        previous: null,
        content: {
            value: true,
        },
    },
    {
        level: 4,
        parent: null,
        previous: null,
        content: {
            value: true,
        },
    },
    {
        level: 4,
        parent: null,
        previous: null,
        content: {
            value: true,
        },
    },
    {
        level: 4,
        parent: null,
        previous: null,
        content: {
            value: true,
        },
    },
    {
        level: 4,
        parent: null,
        previous: null,
        content: {
            value: true,
        },
    },
    {
        level: 4,
        parent: null,
        previous: null,
        content: {
            value: 12,
        },
    },
    {
        level: 4,
        parent: null,
        previous: null,
        content: {
            value: 12,
        },
    },
    {
        level: 4,
        parent: null,
        previous: null,
        content: {
            value: 12,
        },
    },
    {
        level: 4,
        parent: null,
        previous: null,
        content: {
            value: 3,
        },
    },
    {
        level: 4,
        parent: null,
        previous: null,
        content: {
            value: 6,
        },
    },
    {
        level: 4,
        parent: null,
        previous: null,
        content: {
            value: 9,
        },
    },
    {
        level: 4,
        parent: null,
        previous: null,
        content: {
            value: true,
        },
    },
    {
        level: 4,
        parent: null,
        previous: null,
        content: {
            value: 3,
        },
    },
    {
        level: 4,
        parent: null,
        previous: null,
        content: {
            value: 6,
        },
    },
    {
        level: 4,
        parent: null,
        previous: null,
        content: {
            value: 9,
        },
    },
    {
        level: 4,
        parent: null,
        previous: null,
        content: {
            value: 3,
        },
    },
    {
        level: 4,
        parent: null,
        previous: null,
        content: {
            value: 6,
        },
    },
    {
        level: 4,
        parent: null,
        previous: null,
        content: {
            value: 9,
        },
    },
    {
        level: 4,
        parent: null,
        previous: null,
        content: {
            value: true,
            test: "before modification"
        },
    },
    {
        identifier: 50,
        level: 4,
        parent: null,
        previous: null,
        content: {
            value: true,
            test: "modified"
        },
    },
]

module.exports = { demoContent }