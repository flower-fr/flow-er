const path = require("path")
const fs = require("fs").promises
const nodemailer = require("nodemailer")

const createMailClient = ({ config, logger }) => {
    const transporter = nodemailer.createTransport({
        host: config.smtpServer,
        port: Number.parseInt(config.smtpPort),
        secure: config.smtpSecure,
        auth: {
            user: config.smtpUser,
            pass: config.smtpPassword
        }
    })
    return {
        sendMail: sendMail({ logger, transporter })
    }
}

const sendMail = ({ logger, transporter }) => async options => {
    const { from, to, subject, type, content, attachments } = options

    if (!from) throw new Error("missing mail from")
    if (!to) throw new Error("missing mail to")
    if (!subject) throw new Error("missing mail subject")
    if (!content) throw new Error("missing mail content")

    const mailOptions = { from, to, subject, attachments }
    if (type === "html") mailOptions.html = content
    else mailOptions.text = content

    await transporter.sendMail(mailOptions)

    logger && logger.debug(`email sent to ${to}, with subject ${subject}`)
};

module.exports = {
    createMailClient,
    sendMail
}