module.exports = {
    fqdn: { config: "fqdn" },
    endpoint: { value: "api/v1" }, 
    headers: {
        "X-API-KEY": { config: "x-api-key" },
        "accept": { value: "application/json" }
    }
}
