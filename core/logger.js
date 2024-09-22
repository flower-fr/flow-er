const path = require("path");
const fs = require("fs");
const winston = require("winston");

const DEFAULT_MAX_SIZE = 1000000;
const DEFAULT_MAX_FILES = 5;
const CONFIG_DIR = path.resolve(__dirname, "..", "etc");

const checkFile = (dir, filename) => {
    const dirPath = path.resolve(path.isAbsolute(dir) ? dir : path.join(CONFIG_DIR, dir));
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, {mode: 0o755, recursive: true});
    }
    return path.join(dirPath, filename);
};

const createLogger = config => {
    const transports = [];
    const level = config.level || "error";

    const format = winston.format.printf(info => {
        if (info instanceof Error) {
            return `${info.timestamp} ${info.level}: ${info.message} - ${info.stack}`;
        }
        return `${info.timestamp} ${info.level}: ${info.message}`;
    });

    if (config.console) {
        transports.push(new winston.transports.Console());
    }
    if (config.dir && config.filename) {
        const file = checkFile(config.dir, config.filename);
        transports.push(new winston.transports.File({ 
            maxsize: config.maxsize || DEFAULT_MAX_SIZE,
            maxFiles: config.maxFiles || DEFAULT_MAX_FILES,
            filename: file
        }));
    }

    return winston.createLogger({
        level: level,
        format: winston.format.combine(winston.format.timestamp(), format),
        transports
    });
};

module.exports = {
    createLogger
};