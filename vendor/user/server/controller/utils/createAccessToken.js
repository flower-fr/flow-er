const { createToken } = require("../../../../../core/tools/security")

const createAccessToken = async (context, config, user, sql) =>
{
    const payloadModel = config.tokenPayloadModel
    const filters = { "user_id": user.id }
    const rows = await sql.execute({ context, type: "select", entity: payloadModel.entity, columns: Object.keys(payloadModel.columns), where: filters})
    const payload = { id: user.id, status: user.status }
    for (const [key, value] of Object.entries(rows[0])) payload[payloadModel.columns[key]] = value
    return createToken(payload, config.apiKey, config.jwtExpirationTime)
}

module.exports = {
    createAccessToken
}