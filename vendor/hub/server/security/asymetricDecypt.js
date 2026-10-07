const { privateDecrypt } = require("crypto")

const asymetricDecrypt = (encryptedText, privateKey, passphrase) => {
    return privateDecrypt({
        key: privateKey,
        passphrase
    }, Buffer.from(encryptedText, "base64")).toString("utf8")
}

module.exports = {
    asymetricDecrypt
}