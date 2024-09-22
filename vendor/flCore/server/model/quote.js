const moment = require("moment")

const qi = (name) => {
    let result = "`"
    let j = 1
    for (let i = 0; i < name.length; i++) {
        if (name[i] == "`") {
            result += "`"
        }
        result += name[i]
    }
    result += "`"
    return result
}

const qv = (value) => {

    /**
     * Interpret reserved key as value
     */
    if (typeof value === "string") {
        if (value == "today") {
            value = moment().format("YYYY-MM-DD")
        }
        else {
            let split = value.split("+")
            if (split.length == 2) {
                if (split[0] == "today")
                value = moment().add(Number.parseInt(split[1]), "days").format("YYYY-MM-DD")
            }    
            split = value.split("-")
            if (split.length == 2) {
                if (split[0] == "today")
                value = moment().subtract(Number.parseInt(split[1]), "days").format("YYYY-MM-DD")
            }    
        }
    }

    let result = "'"
    let j = 1
    for (let i = 0; i < value.length; i++) {
        if (value[i] == "'") {
            result += "\\"
        }
        result += value[i]
    }
    result += "'"
    return result
}

module.exports = {
    qi,
    qv
}