const crypto = require("crypto")

// Function to encrypt data
function encrypt(context, text) {
    // Create cipher with AES-256-CBC
    const cipher = crypto.createCipheriv("aes-256-cbc", context.encrypt_secret, Buffer.from(context.encrypt_iv, "hex"))

    // Encrypt the data
    let encrypted = cipher.update(text, "utf8", "hex")
    encrypted += cipher.final("hex")

    // Return both the encrypted data and the IV
    return encrypted
}

// Function to decrypt data
function decrypt(context, encryptedData) {
    try {
        // Create decipher
        const decipher = crypto.createDecipheriv(
            "aes-256-cbc",
            context.encrypt_secret,
            Buffer.from(context.encrypt_iv, "hex")
        )

        // Decrypt the data
        let decrypted = decipher.update(encryptedData, "hex", "utf8")
        decrypted += decipher.final("utf8")

        return decrypted
    }
    catch {
        return false
    }
}

module.exports = {
    encrypt, decrypt
}