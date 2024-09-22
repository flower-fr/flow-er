const path = require("path")

const resolveKey = (configPath, key, value) => {
    if (/^\$[a-zA-Z_][a-zA-Z0-9_]*$/.test(value)) {
        const variable = value.substring(1)
        const variableValue = process.env[variable]
        if (variableValue === undefined) {
            throw new Error(`bad definition for key ${key}, missing env variable ${variable}`)
        }
        return variableValue
    }
    else if (key == "dir" || key.endsWith("Dir")) {
        return path.isAbsolute(value) ? value : path.resolve(configPath, value)
    }
    else {
        return value
    }
}

const resolveValues = (configPath, originalConfig) => {
    const config = Object.keys(originalConfig).reduce((conf, key) => {
        const value = originalConfig[key]
        if (typeof value === "object" && !Array.isArray(value)) {
            conf[key] = resolveValues(configPath, value)
        }
        else if (typeof value === "string") {
            conf[key] = resolveKey(configPath, key, value)
        }
        else {
            conf[key] = value
        }
        return conf
    }, {})
    return config
}

const loadConfig = filename => {
    const originalConfig = require(filename)
    const configPath = path.dirname(filename)
    const config = resolveValues(configPath, originalConfig)
    return config
}

module.exports = {
    loadConfig
}
