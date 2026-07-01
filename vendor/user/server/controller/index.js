const { executeService } = require("../../../../core/api-utils")
const { createDbClient } = require("../../../utils/db-client")
const { createSqlClient } = require("../../../flCore/server/model/sql-client")
const { createMailClient } = require("../../../utils/mail-client")
const { login, loginV2 } = require("./login")
const { loginPost, loginPostV2 } = require("./loginPost")
const { sessionCookieMiddleware } = require("./sessionCookieMiddleware")
const { logout } = require("./logout")
const { changePassword } = require("./changePassword")
const { changePasswordPost } = require("./changePasswordPost")
const { createUser } = require("./createUser")
const { register } = require("./register")
const { refreshToken } = require("./refreshToken")

const { checkCredentials, checkActivationToken, saveRefreshToken, checkRefreshToken, requestPasswordReset, resetPassword, sendActivationLink } = require("./credentials")

const registerUser = async ({ context, config, logger, app }) =>
{
    const db = await createDbClient(config.db, context.dbName)
    const sql = await createSqlClient({ config: config.db, logger, dbName: context.dbName })
    const mailClient = createMailClient({ config: config.smtp, logger })
    const execute = executeService(context, config, logger)

    app.get(`${config.prefix}login`, execute(login, context, config, db))
    app.get(`${config.prefix}loginV2`, execute(loginV2, context, config, db))
    app.post(`${config.prefix}login`, execute(loginPost, context, config, sql)) // Deprecated
    app.post(`${config.prefix}loginV2`, execute(loginPostV2, context, config, sql, logger))

    app.use(`${config.prefix}`, sessionCookieMiddleware(config, context))

    app.get(`${config.prefix}logout`, execute(logout, context, db))
    app.get(`${config.prefix}change-password`, execute(changePassword, context, config, db))
    app.post(`${config.prefix}change-password`, execute(changePasswordPost, context, config, db))
    app.post(`${config.prefix}refresh-token`, execute(refreshToken, context, config, sql))

    app.post(`${config.prefix}createuser`, execute(createUser, context, db))
    app.get(`${config.prefix}register`, execute(register, context, db, mailClient))
    app.post(`${config.prefix}checkcredentials`, execute(checkCredentials, context, config))
    app.post(`${config.prefix}/users/checkactivationtoken`, execute(checkActivationToken, context, db))
    app.post(`${config.prefix}requestpasswordreset`, execute(requestPasswordReset, context, db, mailClient))
    app.post(`${config.prefix}/users/refreshtoken/check`, execute(checkRefreshToken, context, db))
    app.post(`${config.prefix}/users/refreshtoken`, execute(saveRefreshToken, context, db))
    app.post(`${config.prefix}resetpassword`, execute(resetPassword, context, db))
    app.post(`${config.prefix}sendactivationlink`, execute(sendActivationLink, context, db, mailClient))
}

module.exports = {
    registerUser
}