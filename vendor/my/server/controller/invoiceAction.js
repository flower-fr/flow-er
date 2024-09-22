const { assert } = require("../../../../core/api-utils")

const { renderInvoice } = require("../view/renderInvoice")

const invoiceAction = async ({ req }, context, db) => {
    return renderInvoice()
}

module.exports = {
    invoiceAction
}