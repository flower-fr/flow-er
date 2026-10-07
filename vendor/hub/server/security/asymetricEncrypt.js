const { publicEncrypt } = require("crypto")

const asymetricEncrypt = (text, publicKey) => {
    return publicEncrypt(publicKey, Buffer.from(text, "utf8")).toString("base64")
}

module.exports = {
    asymetricEncrypt
}