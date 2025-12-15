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
        id: 83,
        formattedName: "Démo CRITE",
        roles: settings.server.config.roles,
        locale: "fr_FR",
        config: {}
    }

    const translations = loadTranslations(middlewares, user.locale)
    let config = loadAppConfig(middlewares)
    config = loadClientConfig(config, settings.server.config.dir, settings.server.config.current)
    config = loadUserConfig(config, user.config)

    const dbName = settings.server.config.dbName

    const localize = (str) => {
        if (str) {
            if (str[user.locale]) return str[user.locale]
            else return str.default    
        }
    }

    const decodeDate = (str) => {
        if (str) {
            return new moment(str).format("DD/MM/YYYY")
        }
        return ""
    }

    const decodeTime = (str) => {
        if (str) {
            return str
        }
    }

    const translate = (str) => {
        if (translations[user.locale] && translations[user.locale][str]) {
            return translations[user.locale][str]
        }
        else return str
    }

    const hasRole = (role) => {
        console.log(user.roles)
        if (user.roles.includes(role)) return true
        return false
    }

    const isAllowed = (entity, view) => {
        let authorization = settings.server.guard[`${entity}:${view}`]
        if (!authorization) authorization = settings.server.guard[`${entity}`]
        if (!authorization) return false
        for (let role of user.roles) {
            if (authorization.roles.includes(role)) return true
        }
        return false
    }

    const context = {

        settings, dbName, instance, user, config, translations,
        localize, decodeDate, decodeTime, translate, hasRole, isAllowed,

        clone: () => {
            return {
                settings: { ...settings }, 
                dbName, 
                instance, 
                user : { ...user }, 
                config: { ...config }, 
                translations: { ...translations },
                localize, decodeDate, decodeTime, translate, hasRole, isAllowed
            }
        }
    }

    return context
}

const loadAppConfig = middlewares => {

    // Load the module config

    const appConfig = {}
    for (let key of Object.keys(middlewares)) {
        const middleware = middlewares[key]
        if (!middleware.status || middleware.status != "disabled") {
            if (fs.existsSync(`${middleware.dir}/config`)) {
                const fileNames = fs.readdirSync(`${middleware.dir}/config`)
                for (let fileName of fileNames) {
                    const configFile = loadConfig(`${middleware.dir}/config/${fileName}`)
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
