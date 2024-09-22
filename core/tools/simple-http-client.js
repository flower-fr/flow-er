const http = require("http");
const https = require("https");
const url = require("url");

const MAX_REDIRECTS = 10;

const createOptions = ({ config, path, method, headers }) => {
    const options = {
        path, method,
        hostname: config.hostname,
        port: config.port,
        headers: {},
        ignoreSslErrors: true
    };
    if (config.headers && typeof config.headers === "object") {
        Object.keys(config.headers).forEach(key => options.headers[key] = config.headers[key]);
    }
    if (headers && typeof headers === "object") {
        Object.keys(headers).forEach(key => options.headers[key] = headers[key]);
    }
    if (config.authType === "bearer") {
        if (config.token) {
            options.headers["Authorization"] = `Bearer ${config.token}`; 
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

const execute = ({ config, path, method, body, headers, redirects = 0 }) => {
    console.log({ config, path, method, body, headers, redirects  });
    const options = createOptions({ config, path, method, headers}) ;
    return new Promise((resolve, reject) => {
        const content = [];
        const scheme = config.scheme === "https" ? https : http;
        const req = scheme.request(options, res => {
            res.on("data", chunk => {
                content.push(chunk);
            });
            res.on("end", async () => {
                const data = Buffer.concat(content);
                const code = res.statusCode;
                if (config.followRedirects && (code === 301 || code === 302 || code === 307 || code === 308)) {
                    try {
                        if (redirects > MAX_REDIRECTS) {
                            return reject(new Error(`max redirects reached (${MAX_REDIRECTS})`));
                        }
                        const location = res.headers.location;
                        if (!location) {
                            return reject(new Error("received redirect without location header"));
                        }
                        let newScheme = config.scheme;
                        let newHostname = config.scheme;
                        let newPath = path;
                        if (location.startsWith("http")) {
                            const newUrl = new url.URL(location);
                            newScheme = newUrl.protocol.split(":")[0];
                            newHostname = newUrl.hostname;
                            newPath = newUrl.pathname;
                        } else {
                            newPath = location;
                        }

                        const newConfig = {
                            ...config,
                            scheme: newScheme,
                            hostname: newHostname
                        };

                        return resolve(await execute({ config: newConfig, path: newPath, method, body, headers, redirects: redirects + 1 }));
                    }
                    catch(error) {
                        return reject(error);
                    }
                }
                resolve({
                    data,
                    statusCode: res.statusCode,
                    headers: res.headers
                });
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

const request = ({ config, method }) => async (path, body, headers) => {
    return await execute({ config, path, method, body, headers });
};

const createHttpClient = config => {
    return {
        get: request({ config, method: "GET" }),
        post: request({ config, method: "POST" }),
        patch: request({ config, method: "PATCH" }),
        put: request({ config, method: "PUT" }),
        del: request({ config, method: "DELETE" }),
        head: request({ config, method: "HEAD" }),
    };
};

module.exports = {
    createHttpClient
};