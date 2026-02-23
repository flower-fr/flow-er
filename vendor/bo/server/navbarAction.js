const { assert } = require("../../../core/api-utils")
const { throwBadRequestError } = require("../../../core/api-utils")
const util = require("util")

const navbarAction = async ({ req }, { logger }) => 
{
    try {
        return [
            200,
            {
                headerParams: {
                    appLink: "https://app.cr-eme.com/",
                    darkMode: true,
                    logo: "logo-glyph.png",
                    title: "DOUBLE CREAM",
                    logoHeight: "40"
                },
                helpMenu: { entries: [] },
                instance: {
                    caption: [ "cr-eme" ],
                    label: "Double Crème",
                    fqdn: "https://intranet.flow-er.fr"
                },
                user: {
                    id: 1,
                    locale: "fr_FR",
                    profile_id: 10,
                    n_fn: "Démo CRITE",
                    place_id: null,
                    role: ["responsible"],
                    iat: 1771166303,
                    exp: 1802702303
                },
                tab: {
                    menu: "menu/crm",
                    controller: "mdb",
                    action: "index",
                    entity: "crm_account",
                    view: "acquisition",
                    label: "Prospects / Clients"
                },
                menu: {
                    "tab/acquisition": {
                        menu: "menu/crm",
                        controller: "mdb",
                        action: "index",
                        entity: "crm_account",
                        view: "acquisition",
                        label: "Prospects / Clients"
                    },
                },
                translations: {
                    "Change password": "Modifier le mot de passe",
                    "Log out": "Se déconnecter",
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
    navbarAction
}