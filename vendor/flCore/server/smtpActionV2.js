const { throwBadRequestError } = require("../../../core/api-utils")
const util = require("util")

const smtpActionV2 = async ({ req }, context, { smtp, testMail, logger }) =>
{
    const form = req.body

    const file = req.file && req.file.buffer
    const fileRow = {}
    if (file) {
        fileRow.data = file
        fileRow.name = req.file.originalname
        fileRow.mime = req.file.mimetype
    }

    try {
        for (const row of JSON.parse(form.rows)) {
            logger && logger.debug(util.inspect({ row }))
            const data = {
                type: "html",
                to: (testMail) ? testMail : row.email,
                subject: row.subject,
                content: row.body.split("\n").join("<br>")
            }
            if (file) {
                data.attachments = { filename: fileRow.name, content: fileRow.data }
            }
            await smtp.sendMail(data)
        }
    }
    catch (err) {
        throw throwBadRequestError()
    }

    return JSON.stringify({ status: "ok"})
}

module.exports = {
    smtpActionV2
}