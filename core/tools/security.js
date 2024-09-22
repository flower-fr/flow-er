const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const encryptPassword = (password, saltOrRounds = 10) => {
    return new Promise((resolve, reject) => {
        bcrypt.hash(password, saltOrRounds, (error, encrypted) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(encrypted);
            }
        });
    });
};

const checkPassword = (password, hash) => {
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, hash, (error, result) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(result);
            }
        });
    });
};

const createToken = (payload, hashKey, expiresIn) => {
    return jwt.sign(payload, hashKey, { expiresIn });
};

const checkToken = (token, hashKey) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, hashKey, (error, payload) => {
            if (error) {
                if (error.name === "TokenExpiredError") {
                    resolve({ status: "expired" });
                }
                if (error.name === "JsonWebTokenError") {
                    resolve({ status: "invalid" });
                }
                else {
                    reject(error);
                }
            }
            else {
                resolve({ status: "ok", payload });
            }
        });
    });
};

const getTokenPayload = token => {
    return jwt.decode(token);
};

module.exports = {
    encryptPassword,
    checkPassword,
    createToken,
    checkToken,
    getTokenPayload
};
