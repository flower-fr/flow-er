const { encryptPassword, createToken } = require("../../../../core/tools/security")
const { assert, throwUnauthorized, throwNotFoundError } = require("../../../../core/api-utils")
const { select } = require("../../../flCore/server/model/select")
const { insert } = require("../../../flCore/server/model/insert")

const createUser = async ({ req }, context, sql) => {

    const [
        email, password
    ] = assert.notEmpty(req.body, "email", "password")

    const model = context.config["user/model"]
    const { result } = await sql.execute({ context, type: "select", entity: "user", columns: ["email"], where: { "email": email } })

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

    await sql.execute({ context, type: "insert", entity: "user", data: userData })

    return { status: "ok" }
};

module.exports = {
    createUser
}