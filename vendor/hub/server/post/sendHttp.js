const { update } = require("../../../flCore/server/model/update")
const { throwBadRequestError, throwInternalError } = require("../../../../core/api-utils")

const sendHttp = async ({ req }, context, interactions, { sql }) => {

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
                await sql.execute({ context, type: "update", entity: "interaction", ids: [interaction.id], data: { "status": "ko" }})
                throw throwInternalError(`Response status: ${response.status}`)
            }

            await sql.execute({ context, type: "update", entity: "interaction", ids: [interaction.id], data: { "status": "ok" }})
        }
        catch (err) {
            await sql.execute({ context, type: "update", entity: "interaction", ids: [interaction.id], data: { "status": "ko" }})
            throw throwBadRequestError()
        }
    }
}

module.exports = {
    sendHttp
}