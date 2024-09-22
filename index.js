const path = require("path")
const dotenv = require("dotenv")

const { loadContext } = require("./core/context-manager")
const { loadConfig } = require("./core/config-manager")
const { createLogger } = require("./core/logger")
const { startServer } = require("./core/server")

const CONFIG_FILE = path.resolve(__dirname, "etc", "settings.json")

dotenv.config()

const config = loadConfig(CONFIG_FILE)
const logger = createLogger(config.log)
const context = loadContext(config, logger)

startServer(context, config, logger)