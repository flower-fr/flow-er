const { createDbClient2 } = require("../../../utils/db-client")
const { encryptPassword, createToken } = require("../../../../core/tools/security")
const { assert, throwUnauthorized, throwNotFoundError } = require("../../../../core/api-utils")
const { select } = require("../../../flCore/server/model/select")
const { insert } = require("../../../flCore/server/model/insert")

const createUser = async ({ req }, context, config) => {

    const db = await createDbClient2(config.db, context.dbName)

    const [
        email, password
    ] = assert.notEmpty(req.body, "email", "password")

    const model = context.config["user/model"]
    const [result, fields] = (await db.execute(select(context, "user", ["email"], { "email": email }, null, null, model)))[0]
    if (result) {
        return throwUnauthorized("user already exist", "ALREADY_EXIST")
    }

    const encryptedPassword = await encryptPassword(password)
    const userData = {
        status: "pending",
        email: email,
        last_updated: `${new Date().toISOString().slice(0, 19).replace("T", " ")}`,
        last_login: null,
        login_failed: 0,
        password: encryptedPassword
    }

    await db.execute(insert(context, "user", userData, model))

    return { status: "ok" }
};

module.exports = {
    createUser
}