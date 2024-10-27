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
        sendMail: sendMail({ logger, transporter, from: config.from })
    }
}

const sendMail = ({ logger, transporter, from }) => async options => {
    const { to, subject, type, content, attachments } = options

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