const { resendSmtp } = require("./post/sendSmtp")

const smtpAction = async ({ req }, context, { sql, smtp, testMail, logger }) =>
{
    const ids = (req.params.id) && [req.params.id] 
    await resendSmtp({ context, sql, smtp, ids, testMail })
}

module.exports = {
    smtpAction
}