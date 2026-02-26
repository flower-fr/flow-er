const { assert } = require("../../../core/api-utils")
const { throwBadRequestError } = require("../../../core/api-utils")
const util = require("util")

const formAction = async ({ req }, { logger }) => 
{
    try {
        return [
            200,
            {
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
                    identifier: {
                        type: "input",
                        label: "SIREN / SIRET",
                        required: true,
                    },
                    adr_street: {
                        type: "input",
                        label: "Adresse",
                        required: true,
                    },
                    adr_zip: {
                        type: "input",
                        label: "Code postal",
                        required: true,
                    },
                    adr_city: {
                        type: "input",
                        label: "Ville",
                        required: true,
                    },
                    date: {
                        type: "date",
                        label: "Date",
                        required: true,
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
                },
                posts: {
                    add: {
                        method: "POST",
                        controller: "core",
                        action: "v1",
                        entity: "crm_account",
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
            },
            "application/json"
        ]        
    }
    catch(err) {
        logger && logger.error(err)
        throw throwBadRequestError()
    }
}

module.exports = {
    formAction
}