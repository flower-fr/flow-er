const { assert } = require("../../../../core/api-utils")

const { renderMail } = require("../view/renderMail")

const mailAction = async ({ req }, context, db) => {
    return renderMail()
}

module.exports = {
    mailAction
}