const { securizeForm } = require("./securizeForm")

const postForm = async ({ req }, context, config, sql, logger) => {
    const form = req.body

    const result = securizeForm({ context, googleApiKey: config.googleApiKey, recaptchaProject: config.recaptchaProject, recaptchaToken: config.recaptchaToken, emailableApiKey: config.emailableApiKey, form , sql, logger })
    return JSON.stringify(result)
}

module.exports = {
    postForm
}