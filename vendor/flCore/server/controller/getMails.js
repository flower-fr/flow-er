const { insert } = require("../model/insert")
const { select } = require("../model/select")

const getMails = async ({ context, connection, imap, whiteList }) => {
    const mails = await imap.getMails()
    const identifiers = mails.map(x => x.identifier)
    const model = context.config["interaction/model"]

    // Retrieve existing mail identifiers
    const where = { "identifier": ["in"] }
    for (const identifier of identifiers) {
        where["identifier"].push(identifier)
    }
    const request = select(context, "interaction", ["identifier"], where, null, null, model)
    const [cursor] = await connection.execute(request)
    const duplets = cursor.map(x => x.identifier)

    const result = []
    for (const mail of mails) {

        // Only keep emails not already loaded and restricted to a optionnal given list of senders
        let email = mail.headers.from[0].split("<")
        email = (email.length > 1) ? email[1] : email[0]
        email = email.split(">")
        email = email[0]
        if (!duplets.includes(mail.identifier) && (!whiteList || whiteList.includes(email))) {
            const data = {
                "identifier": mail.identifier,
                "status": "ok",
                "provider": "imap",
                "endpoint": "getEMails",
                "method": "GET",
                "params": mail.headers,
                "body": mail.body
            }        
            const [insertedRow] = (await connection.execute(insert(context, "interaction", data, model)))
            data.id = insertedRow.insertId
            result.push(data)
        }
    }
    return result
}

module.exports = {
    getMails
}