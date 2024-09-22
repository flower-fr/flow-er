const path = require("path")
const fs = require("fs")
const moment = require("moment")
const { loadConfig } = require("./config-manager")

const loadContext = (settings, logger) => {

    const middlewares = settings.server.middlewares
    if (!middlewares) {
        return
    }

    const instance = {
        caption: settings.server.config.current,
        label: settings.server.config.label,
        fqdn: "https://intranet.flow-er.fr"
    }

    const user = {
        //instance_id: 1,
        id: 83,
        formattedName: "Démo CRITE",
        roles: ["sales_manager"],
        locale: "fr_FR",
        config: {}
    }

    const translations = loadTranslations(middlewares, user.locale)
    let config = loadAppConfig(middlewares)
    config = loadClientConfig(config, settings.server.config.dir, settings.server.config.current)
    config = loadUserConfig(config, user.config)

    const context = {

        settings: settings,
        dbName: settings.server.config.dbName,
        instance: instance,
        user: user,
        config: config,
        translations: translations,

        localize: (str) => {
            if (str) {
                if (str[user.locale]) return str[user.locale]
                else return str.default    
            }
        },

        decodeDate: (str) => {
            if (str) {
                return new moment(str).format("DD/MM/YYYY")
            }
            return ""
        },

        decodeTime: (str) => {
            if (str) {
                return str
            }
        },

        translate: (str) => {
            if (translations[user.locale][str]) {
                return translations[user.locale][str]
            }
            else return str
        },

        isAllowed: (route) => {
            if (config.guard[route]) {
                for (let role of user.roles) {
                    if (config.guard[route].roles.includes(role)) return true
                }
                return false
            }
            else return true
        }
    }

    return context
}

const loadAppConfig = middlewares => {

    // Load the module config

    const appConfig = {}
    for (let key of Object.keys(middlewares)) {
        if (fs.existsSync(`${middlewares[key].dir}/config`)) {
            const fileNames = fs.readdirSync(`${middlewares[key].dir}/config`)
            for (let fileName of fileNames) {
                const configFile = loadConfig(`${middlewares[key].dir}/config/${fileName}`)
                for (let key of Object.keys(configFile)) {
                    if (appConfig[key]) {
                        for (let subkey of Object.keys(configFile[key])) {
                            appConfig[key][subkey] = configFile[key][subkey]
                        }
                    }
                    else appConfig[key] = configFile[key]
                }    
            }
        }
    }
    return appConfig
}

const loadClientConfig = (appConfig, dir, current) => {

    // Load the module config

    for (let key of current) {
        if (fs.existsSync(`${dir}/${key}`)) {
            const fileNames = fs.readdirSync(`${dir}/${key}`)
            for (let fileName of fileNames) {
                if (fileName[0] !== ".") {
                    const configFile = loadConfig(`${dir}/${key}/${fileName}`)
                    for (let key of Object.keys(configFile)) {
                        appConfig[key] = configFile[key]
                    }        
                }
            }
        }
    }
    return appConfig
}

const loadUserConfig = (appConfig, userConfig) => {
    for (let key of Object.keys(userConfig)) {
        appConfig[key] = userConfig[key]
    }        
    return appConfig
}

const loadTranslations = (middlewares, locale) => {
    const translations = {}
    translations[locale] = {}
    for (let key of Object.keys(middlewares)) {
        if (fs.existsSync(`${middlewares[key].dir}/language/${locale}.json`)) {
            const lang = JSON.parse(fs.readFileSync(`${middlewares[key].dir}/language/${locale}.json`, "utf8"))
            for (let key of Object.keys(lang)) {
                translations[locale][key] = lang[key]
            }
        }
    }
    return translations
}

module.exports = {
    loadContext
}
