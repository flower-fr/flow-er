const { update } = require("../model/update")
const { throwBadRequestError, throwInternalError } = require("../../../../core/api-utils")

const sendHttp = async ({ req }, context, interactions, { connection }) => {

    const type = "html"
    const model = context.config["interaction/model"]
    
    /**
     * Send the batch of messages
     */

    for (let interaction of interactions) {

        const headers = {}
        for (const [header, value] of Object.entries(interaction.headers)) {
            if (header === "Authorization") headers[header] = `${header}${config[interaction.provider].key}`
            else headers[header] = value
        }
        try {
            const response = await fetch(`https://${ interaction.provider }/${ interaction.endpoint }`, {
                method: interaction.method,
                headers: headers,
                body: interaction.body
            })

            if (!response.ok) {
                await connection.execute(update(context, "interaction", [interaction.id], { "status": "ko" }, model))
                throw throwInternalError(`Response status: ${response.status}`)
            }

            /**
             * Mark for each message the interaction as OK
             */

            await connection.execute(update(context, "interaction", [interaction.id], { "status": "ok" }, model))
        }
        catch (err) {
                
            /**
             * Mark the interaction as KO
             */

            await connection.execute(update(context, "interaction", [interaction.id], { "status": "ko" }, model))
            throw throwBadRequestError()
        }
    }
}

module.exports = {
    sendHttp
}