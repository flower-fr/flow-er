const { loadData } = require("./loadData")
const { asymetricDecrypt } = require("../../security/asymetricDecypt")
const util = require("util")

const consumeTransfer = async ({ entity, transfer_id, sender_identifier, recipient_identifier, passphrase, privateKey }, context, sql, smtp, logger) => {

    logger && logger.debug(`Entrée dans la fonction consumeTransfer : \nentity = ${entity}, \ntransfer_id = ${transfer_id}, \nsender_id = ${sender_identifier}, \nrecipient_id = ${recipient_identifier}\n`)

    const transferModel = context.config[`${entity}/model`]

    if (!transferModel) return [400, `Model for entity ${entity} not found in config`] // return error 400 if the entity given is incorrect

    await sql.getConnection()
    await sql.beginTransaction()

    let result
    // try {

    result = (await sql.execute({ context, type: "select", entity, columns: ["id", "sender_identifier", "sender_n_fn", "sender_email", "sender_place_name", "recipient_identifier", "recipient_email", "data", "content_type"], where: { id: transfer_id } }))[0]
    if (result["sender_identifier"] != sender_identifier || result["recipient_identifier"] != recipient_identifier) return [401, "Unauthorized : Sender or recipient does not match the transfer"] // return error 401 if the sender or recipient does not match the transfer

    await sql.execute({ context, type: "update", entity, data: { status: "consumed" }, ids: [transfer_id] })
    let decrypted = []
    for (let chunk of result.data.split("\n")) {
        logger && logger.debug(`consumeTransfer checkpoint 0 : chunk = \n${util.inspect(chunk, {colors: true})}`)
        chunk = asymetricDecrypt(chunk, privateKey, passphrase)
        decrypted.push(chunk.substring(1, chunk.length-1))
    }

    let content
    if (result.content_type === "application/json") {
        decrypted = JSON.parse(decrypted.join("").replace(/\\"/g, '"'))
        logger && logger.debug(`consumeTransfer checkpoint 2 : Decrypted data = \n${util.inspect(decrypted, {colors: true, depth: null})}`)
        await loadData(context, sql, decrypted, logger)
    } else if (result.content_type === "application/pdf") {
        content = Buffer.from(decrypted.join(""), "base64")
        logger && logger.debug(`consumeTransfer checkpoint 2 : Decrypted data = \n${util.inspect(decrypted, {colors: true, depth: null})}`)
    } else {
        return [400, `Content type "${result.content_type}" not supported`]
    }

    // const data = {
    //     type: "html",
    //     to: result.sender_email,
    //     subject: "Ouverture d'un transfer",
    //     content: "Bla bla Le dernier transfer a été ouvert",
    //     cc: result.recipient_email
    // }
    // smtp.sendMail(data)

    await sql.commit()
    await sql.releaseConnection()

    // } catch (error) {
    //     await sql.rollback()
    //     await sql.releaseConnection()
    //     console.error("Error decrypting transfer data:", error)
    //     throw new Error("Failed to decrypt transfer data")
    // }
    
    return {...result, content}
}

module.exports = {
    consumeTransfer
}