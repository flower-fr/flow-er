const { renderResendLink } = require("../view/resend-link")
const { createToken, checkToken } = require("../../../../core/tools/security")
const { assert } = require("../../../../core/api-utils")

const resendLink = async ({ req }, context, sql, mailClient, config) => {
    const [email, csrfToken] = assert.notEmpty(req.body, "email", "csrfToken")

    // Check CSRF token
    let csrfStatus
    try { ({ status: csrfStatus } = await checkToken(csrfToken, config.apiKey)) }
    catch (error) { return [500, { message: "Internal server error" }, "application/json"] }
    if (csrfStatus === "invalid") {
        return [400, { message: "Invalid CSRF token" }, "application/json"]
    }
    else if (csrfStatus === "expired") {
        return [400, { message: "Expired CSRF token" }, "application/json"]
    }

    // Check user status
    const user = (await sql.execute({ context, type: "select", entity: "user", columns: ["id", "email", "status"], where: { email } }))[0]
    if (!user || user.status !== "pending") return

    // Generate activation token
    const token = createToken({ userId: user.id }, config.apiKey, 60 * 60)

    // Prepare email content
    const data = { 
        activationLink: `${config.baseUrl}/user/new-password?token=${token}`,
        instanceCaption: "Flow-er"
    }
    const content = renderResendLink(context, data)

    // Send email to user
    await mailClient.sendMail({
        type: "html",
        from: "support@p-pit.fr",
        to: user.email,
        subject: "Votre nouveau lien d'activation",
        content: content
    })
    return [200, { message: "ok" }, "application/json"]
}

module.exports = {
    resendLink
}