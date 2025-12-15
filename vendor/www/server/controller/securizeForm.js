const { assert } = require("../../../../core/api-utils")
const util = require("util")

const { throwBadRequestError } = require("../../../../core/api-utils")

const securizeForm = async ({ context, googleApiKey, recaptchaProject, recaptchaToken, emailableApiKey, form , sql, logger }) => {

    let status = "ok"

    try {

        /**
         * Recaptcha
         */
        logger && logger.debug(util.inspect({ googleApiKey, recaptchaProject }))
        const interactionParams = {}
        const response = await fetch(`https://recaptchaenterprise.googleapis.com/v1/projects/${recaptchaProject}/assessments?key=${ googleApiKey }`, {
            method: "POST",
            body: JSON.stringify({
                "event": {
                    "token": form.gRecaptchaResponse,
                    "siteKey": recaptchaToken,
                }
            })
        })
        const recaptchaJson = await response.json()
        interactionParams.recaptcha = recaptchaJson
        if (!recaptchaJson.riskAnalysis || recaptchaJson.riskAnalysis.score < 0.3 ) status = "unprocessable"

        if (status === "ok") {
            /**
             * Emailable
             */
            const emailableResponse = await fetch(`https://api.emailable.com/v1/verify?email=${ form.email }&api_key=${ emailableApiKey }`)
            const emailableJson = await emailableResponse.json()
            interactionParams.emailable = emailableJson
            if (emailableJson.state !== "deliverable") status = "undelivrable"
        }

        /**
         * Log interaction
         */
        const interactionModel = context.config["interaction/model"]

        let data = {
            status: "new",
            provider: "www",
            endpoint: "/",
            method: "POST",
            params: JSON.stringify(interactionParams)
        }
        await sql.execute({ context, type: "insert", entity: "interaction", data, model: interactionModel })

        return { status }
    }
    catch (err) {
        logger && logger.debug(util.inspect(err))
        throw throwBadRequestError()
    }
}

module.exports = {
    securizeForm
}