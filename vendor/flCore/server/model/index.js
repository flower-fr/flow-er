const { join } = require("./join")
const { quote } = require("./quote")
const { select } = require("./select")
const { insert } = require("./insert")
const { update } = require("./update")
const { updateCase } = require("./updateCase")

const getModel = async (config, context) => {
    return {
        join: join,
        quote: quote,
        select: select,
        insert: insert,
        update: update,
        updateCase: updateCase
    }
}

module.exports = {
    getModel
}