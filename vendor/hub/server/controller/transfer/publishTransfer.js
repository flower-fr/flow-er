
const { chunkString } = require("../../security/chunkString")
const { asymetricEncrypt } = require("../../security/asymetricEncrypt")
const util = require("util")

const publishTransfer = async ({ entity, sender, recipient, content_type, content }, context, sql, smtp, logger) => {

    logger && logger.debug("dans la fonction publishTransfer")

    const transferModel = context.config[`${entity}/model`]

    if (!transferModel) return [400, `Model for entity ${entity} not found in config`] // return error 400 if the entity given is incorrect

    const transferData = {
        sender_identifier: sender.identifier,
        recipient_identifier: recipient.identifier,
        status: "published",
    }

    logger && logger.debug(`publishTransfer checkpoint 1 : transferData = ${JSON.stringify(transferData)}`)

    let publicKey = await sql.execute({ context, type: "select", entity: "place", columns: ["public_key"], where: {id : recipient.id} })
    publicKey = publicKey[0]?.public_key
    if (!publicKey) return [400, "Recipient public key not found"]

    logger && logger.debug(`publishTransfer checkpoint 3 : publicKey = ${JSON.stringify(publicKey)}`)

    try {
        let data
        if (content_type.includes("application/json")) {
            data = JSON.stringify(content)
            transferData.content_type = "application/json"
        }
        else if (content_type.includes("application/pdf")) {
            data = content.toString("base64")
            transferData.content_type = "application/pdf"
        } 
        else {
            data = content
            transferData.content_type = content_type
        }

        logger && logger.debug(`publishTransfer checkpoint 3.5 : data = ${util.inspect(data, {colors: true, depth: null})}`)

        const chunks = chunkString(data, 387)
        const encrypted = []
        for (const chunk of chunks) {
            encrypted.push(asymetricEncrypt(JSON.stringify(chunk), publicKey))
        }
        transferData.data = encrypted.join("\n")

        logger && logger.debug(`publishTransfer checkpoint 4 : transferData.data = ${JSON.stringify(transferData.data)}`)

        await sql.execute({ context, type: "insert", entity, data: transferData, debug: true })
    
        // const recipientEmail = await sql.execute({ context, type: "select", entity: "place", columns: ["email"], where: {id : recipient.id} })
        // const senderEmail = await sql.execute({ context, type: "select", entity: "place", columns: ["email"], where: {id : sender.id} })

        // logger && logger.debug(`publishTransfer checkpoint 5 : recipientEmail = ${JSON.stringify(recipientEmail)}, senderEmail = ${JSON.stringify(senderEmail)}`)

        // logger && logger.debug(`publishTransfer checkpoint 6 : Send a mail to : ${senderEmail[0].email}`)
        // const data = {
        //     type: "html",
        //     to: recipientEmail[0].email,
        //     subject: "Nouveau transfert à télécharger",
        //     content: "Bla bla Vous pouvez le télécharger via l’API",
        //     cc: senderEmail[0].email
        // }
        // await smtp.sendMail(data)

    } catch (error) {

        console.error("Error publishing transfer:", error)
        throw new Error("Failed to publish transfer")
        
    }
}

const chunkSubstr = (str, size) => 
{
    const numChunks = Math.ceil(str.length / size)
    const chunks = new Array(numChunks)
  
    for (let i = 0, o = 0; i < numChunks; ++i, o += size) {
        chunks[i] = str.substr(o, size)
    }

    return chunks
}

module.exports = {
    publishTransfer
}