const { renderCreateAccount } = require("../view/create-account")

const register = async ({ req }, context, db, mailClient) => {
    const data = { 
        activationLink: "http://localhost:5010/applee/index",
        registrationLink: "http://localhost:5010/bo/index/account",
        instanceCaption: "Applee"
    }
    const content = renderCreateAccount(context, data)

    await mailClient.sendMail({
        type: "html",
        from: "support@p-pit.fr",
        to: "bruno@lartillot.net",
        subject: "Register",
        content: content
    })
}

module.exports = {
    register
}