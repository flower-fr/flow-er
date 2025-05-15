const nodemailer = require("nodemailer")
const imaps = require("imap-simple")
const { createHash } = require("node:crypto")

const createMailClient = ({ config, logger }) => {
    const transporter = nodemailer.createTransport({
        host: config.smtpServer,
        port: Number.parseInt(config.smtpPort),
        secure: config.smtpSecure,
        auth: {
            user: config.smtpUser,
            pass: config.smtpPassword
        },
        debug: false,
        logger: true
    })
    return {
        sendMail: sendMail({ logger, transporter, from: config.from, forcedTo: config.to })
    }
}

const sendMail = ({ logger, transporter, from, forcedTo }) => async options => {
    const { to, subject, type, content, attachments } = options
    if (!to) throw new Error("missing mail to")
    if (!subject) throw new Error("missing mail subject")
    if (!content) throw new Error("missing mail content")

    const mailOptions = { from, to: forcedTo || to, subject, attachments }
    if (type === "html") mailOptions.html = content
    else mailOptions.text = content

    await transporter.sendMail(mailOptions)

    logger && logger.debug(`email sent to ${forcedTo}, with subject ${subject}`)
}

const createImapClient = ({ config, logger }) => {
    return {
        getMails: getMails({ config, logger })
    }
}


const getMails = ({ config, logger }) => async () => 
{
    console.log(config.imapUser, config.imapPassword, config.imapServer, config.imapPort)
    const connection = await imaps.connect({
        imap: {
            user: config.imapUser,
            password: config.imapPassword,
            host: config.imapServer,
            port: config.imapPort,
            authTimeout: 10000,
            tls: true,
            tlsOptions: { rejectUnauthorized: false },
        }
    })

    await connection.openBox("INBOX")
    const searchCriteria = ["UNSEEN"]
    const fetchOptions = {
        bodies: ["HEADER", "TEXT"],
        markSeen: false,
    }

    const result = []
    const mails = await connection.search(searchCriteria, fetchOptions)
    for (const mail of mails) {
        const data = {
            "status": "ok",
            "provider": "imap",
            "endpoint": "getEMails",
            "method": "GET"
        }
        for (const part of mail.parts) {
            if (part.which === "HEADER") data.headers = part.body
            else if (part.which === "TEXT") data.body = part.body
        }
        if (data.headers && data.body) {
            data.identifier = createHash("sha256").update(`${data.headers.from} ${data.headers.date}`).digest("hex")
            result.push(data)
        }
    }
    connection.end()
    logger && logger.debug("email received")
    return result
}

module.exports = {
    createMailClient,
    sendMail,
    createImapClient
}