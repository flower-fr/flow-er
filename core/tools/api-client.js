const http = require("http");
const https = require("https");

const createOptions = ({ auth, config, path, method, headers }) => {
    const options = {
        path, method,
        hostname: config.hostname,
        port: config.port,
        headers: {
            "Content-Type": "application/json"
        },
        ignoreSslErrors: true
    };
    if (config.headers && typeof config.headers === "object") {
        Object.keys(config.headers).forEach(key => options.headers[key] = config.headers[key]);
    }
    if (headers && typeof headers === "object") {
        Object.keys(headers).forEach(key => options.headers[key] = headers[key]);
    }
    if (config.authType === "bearer") {
        if (auth.token) {
            options.headers["Authorization"] = `Bearer ${auth.token}`; 
        }    
    }
    if (config.authType === "header" && config.id) {
        options.headers[config.id] = config.password; 
    }
    else if (config.authType === "basic" && config.id) {
        const isPassword = config.password !== undefined && config.password !== null;
        options.headers["Authorization"] = `Basic ${Buffer.from(`${config.id}${isPassword ? `:${config.password}` : ""}`).toString("base64")}`; 
    }

    return options;
};

const execute = ({auth, config, path, method, body, headers, onlyHeaders}) => {
    const options = createOptions({auth, config, path, method, headers})
    return new Promise((resolve, reject) => {
        const content = [];
        const scheme = config.scheme === "https" ? https : http;
        const req = scheme.request(options, res => {
            res.on("data", chunk => {
                content.push(chunk)
            });
            res.on("end", () => {
                let data = Buffer.concat(content);
                if (res.statusCode < 400) {
                    if (onlyHeaders) {
                        resolve(res.headers)
                    }
                    else {
                        if (res.headers["content-type"] && res.headers["content-type"].startsWith("application/json")) {
                            resolve(JSON.parse(data));
                        }
                        else {
                            resolve(data)
                        }
                    }
                }
                else {
                    const error = new Error(`error code ${res.statusCode}`);
                    error.data = data;
                    error.statusCode = res.statusCode;
                    try {
                        if (res.headers["content-type"].startsWith("application/json")) {
                            data = JSON.parse(data);
                        }
                        error.message = data.reason;
                        error.reasonCode = data.code;
                    }
                    catch (err) {
                        // empty
                    }
                    reject(error);
                }
            });
        });
        req.on("error", reject);
        if (body) {
            if (typeof body === "object") {
                req.write(JSON.stringify(body));
            }
            else {
                req.write(body);
            }
        }
        req.end();
    });
};

const createToken = async ({auth, config}) => {
    const { token } = await execute({auth, config, path: config.createTokenUrl, method: "POST", body: config.params});
    return token;
};

const request = ({ auth, config, method , onlyHeaders }) => async (path, body, headers) => {
    try {
        if (config.authType === "bearer" && config.createTokenUrl && auth.token == null) {
            auth.token = await createToken({auth, config});
        }
        return await execute({auth, config, path, method, body, headers, onlyHeaders});
    }
    catch (error) {
        if (error.statusCode === 401 && config.authType === "bearer" && config.createTokenUrl) {
            auth.token = await createToken({auth, config});
            return await execute({auth, config, path, method, body, headers, onlyHeaders});
        }
        else {
            throw error;
        }
    }
};

const createApiClient = config => {
    const auth = {
        token: config.bearerToken
    }
    //const auth = {}
    return {
        get: request({ auth, config, method: "GET" }),
        post: request({ auth, config, method: "POST" }),
        patch: request({ auth, config, method: "PATCH" }),
        put: request({ auth, config, method: "PUT" }),
        del: request({ auth, config, method: "DELETE" }),
        head: request({ auth, config, method: "HEAD", onlyHeaders: true }),
    };
};

module.exports = {
    createApiClient
};