const { executeService } = require("../../core/api-utils")
const { qi, qv } = require("./server/model/quote")
const { select } = require("./server/model/select")

const registerBoUnitTest = async ({ context, config, logger, app }) => {
    const execute = executeService(config, logger)
    app.get(`${config.prefix}unit-test`, execute(test, context))
}

const test = (context) => {
    console.log(qi("a'b`cde"))
    console.log(qv("abc'de"))

    const model = {
        entities: {
            vcard: { table: "vcard", foreignKey: "contact_1_id", foreignEntity: "account" }
        },
        properties: {
            id: { entity: "account", column: "id", type: "int" },
            email: { entity: "vcard", column: "email", type: "email" }
        }
    }
    console.log(select(context, "account", ["id", "email"], { email: "a.b@test.com" }, { email: "ASC" }, 100, model))
}

module.exports = {
    registerBoUnitTest
}