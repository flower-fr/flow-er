const { assert } = require("../../../core/api-utils")

const rulesAction = async ({ req }, { context }) => 
{
    const application = assert.notEmpty(req.params, "application")
    const config = context.config[`viewModel_rules_${ application }`]

    // Translations
    const locale = context.user.locale
    if (config.translations) {
        if (config.translations[locale]) {
            config.translations = config.translations[locale]
        } else if (config.translations.default) {
            config.translations = config.translations.default
        }
    }

    return [200, config, "application/json"]
}

module.exports = rulesAction