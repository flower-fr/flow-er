const { createToken } = require("../../../../core/tools/security")
const { renderNewPassword } = require("../view/renderNewPassword")
const { checkToken } = require("../../../../core/tools/security")
const crypto = require("crypto")

const newPassword = async ({ req }, context, config, sql) => {
    try { 
        // Check token in query string
        const token = req.query.token
        if (!token) {
            return renderNewPassword({ context, rule: config.passwordRule || context.config["user/password"]["rule"] }, {
                status: "400",
                headerParams: context.config.headerParams,
                instance: context.instance,
                footer: context.config.footer,
                csrfToken: createToken({ form: "user/resend-link" }, config.apiKey, 600)
            })
        }
        let status, payload
        ({ status, payload } = await checkToken(token, config.apiKey))
        if (status === "invalid") {
            return renderNewPassword({ context, rule: config.passwordRule || context.config["user/password"]["rule"] }, {
                status: "400",
                headerParams: context.config.headerParams,
                instance: context.instance,
                footer: context.config.footer,
                csrfToken: createToken({ form: "user/resend-link" }, config.apiKey, 600)
            })
        }
        else if (status === "expired") {
            return renderNewPassword({ context, rule: config.passwordRule || context.config["user/password"]["rule"] }, {
                status: "410",
                headerParams: context.config.headerParams,
                instance: context.instance,
                footer: context.config.footer,
                csrfToken: createToken({ form: "user/resend-link" }, config.apiKey, 600)
            })
        }
        else if (status !== "ok") {
            return renderNewPassword({ context, rule: config.passwordRule || context.config["user/password"]["rule"] }, {
                status: "500",
                headerParams: context.config.headerParams,
                instance: context.instance,
                footer: context.config.footer,
                csrfToken: createToken({ form: "user/resend-link" }, config.apiKey, 600)
            })
        }

        const user = (await sql.execute({ context, type: "select", entity: "user", columns: ["password_token_hash"], where: { id: payload.userId } }))[0]
        const hash = crypto.createHash("sha256").update(token).digest("hex")
        if (user.password_token_hash !== hash) {
            return renderNewPassword({ context, rule: config.passwordRule || context.config["user/password"]["rule"] }, {
                status: "410",
                headerParams: context.config.headerParams,
                instance: context.instance,
                footer: context.config.footer,
                csrfToken: createToken({ form: "user/resend-link" }, config.apiKey, 600)
            })
        }

        const data = {
            headerParams: context.config.headerParams,
            instance: context.instance,
            footer: context.config.footer,
            token: token,
            csrfToken: createToken({ form: "user/new-password" }, config.apiKey, 600),
        }

        return renderNewPassword({ context, rule: config.passwordRule || context.config["user/password"]["rule"] }, data)
    }
    catch (error) {
        return renderNewPassword({ context, rule: config.passwordRule || context.config["user/password"]["rule"] }, {
            status: "500",
            headerParams: context.config.headerParams,
            instance: context.instance,
            footer: context.config.footer,
            csrfToken: createToken({ form: "user/resend-link" }, config.apiKey, 600)
        })
    }
}

module.exports = {
    newPassword
}