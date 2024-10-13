const { executeService, assert } = require("../../../../core/api-utils")
const { createDbClient2 } = require("../../../utils/db-client")
const { createMailClient } = require("../../../utils/mail-client")
const { login } = require("./login")
const { loginPost } = require("./loginPost")
const { checkCredentials, checkActivationToken, saveRefreshToken, checkRefreshToken, requestPasswordReset, resetPassword, sendActivationLink } = require("./credentials");
const { createUser } = require("./createUser")
const { register } = require("./register")

const registerUser = async ({ context, config, logger, app }) => {
    const db = await createDbClient2(config.db)
    const mailClient = null //createMailClient({ config: config.smtp, logger })
    const execute = executeService(context, config, logger)

    app.get(`${config.prefix}login`, execute(login, context, db))
    app.post(`${config.prefix}login`, execute(loginPost, context, config))
    app.post(`${config.prefix}createuser`, execute(createUser, context, config))
    app.get(`${config.prefix}register`, execute(register, context, db, mailClient))
    app.post(`${config.prefix}checkcredentials`, execute(checkCredentials, context, config));
    app.post(`${config.prefix}/users/checkactivationtoken`, execute(checkActivationToken, context, db));
    app.post(`${config.prefix}/users/requestpasswordreset`, execute(requestPasswordReset, context, db, mailClient));
    app.post(`${config.prefix}/users/refreshtoken/check`, execute(checkRefreshToken, context, db));
    app.post(`${config.prefix}/users/refreshtoken`, execute(saveRefreshToken, context, db));
    app.post(`${config.prefix}/users/resetpassword`, execute(resetPassword, context, db));
    app.post(`${config.prefix}sendactivationlink`, execute(sendActivationLink, context, db, mailClient));
}

module.exports = {
    registerUser
}