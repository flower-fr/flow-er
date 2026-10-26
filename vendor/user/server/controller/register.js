const { renderCreateAccount } = require("../view/create-account")
const { createToken } = require("../../../../core/tools/security")
const { assert } = require("../../../../core/api-utils")

const register = async ({ req }, context, sql, mailClient, config) => {
    const userId = assert.notEmpty(req.params, "userId")

    // Check user status
    const user = (await sql.execute({ context, type: "select", entity: "user", columns: ["id", "email", "status"], where: { id: userId } }))[0]
    if (!user) return [404, { message: "User not found" }, "application/json"]
    if (user.status !== "pending") return [400, { message: "User is not in pending status" }, "application/json"]

    // Generate activation token
    const token = createToken({ userId: user.id }, config.apiKey, 48 * 60 * 60)

    // Prepare email content
    const data = { 
        activationLink: `${config.baseUrl}/user/new-password?token=${token}`,
        instanceCaption: config.instanceCaption
    }
    const content = renderCreateAccount(context, data)

    // Send email to user
    await mailClient.sendMail({
        type: "html",
        from: "support@p-pit.fr",
        to: user.email,
        subject: "Activez votre nouveau compte PPIT",
        content: content
    })
}

module.exports = {
    register
}