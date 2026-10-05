const crypto = require("crypto")

const generateKeyPair = (passphrase) => {
    const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
        modulusLength: 4096,
        publicKeyEncoding: {
            type: "spki",
            format: "pem"
        },
        privateKeyEncoding: {
            type: "pkcs8",
            format: "pem",
            cipher: "aes-256-cbc",
            passphrase: passphrase 
        }
    })
  
    return {
        publicKey,
        privateKey
    }
}

module.exports = {
    generateKeyPair
}