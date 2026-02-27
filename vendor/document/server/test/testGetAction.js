const { throwBadRequestError } = require("../../../../core/api-utils")
const util = require("util")

const testGetAction = async ({ req }, context, { sql, logger }) => {
    req
    sql

    const route = "http://0.0.0.0:5010/document/v1/document/", result = []
    const data = [
        {
            identifier: "",
            test: (result) => {
                console.log("dans test")
                if (result.length === 4) return "ok"
                else return "erreur : le nombre de cellules retournées n'est pas correct"
            }
        },
        {
            identifier: "cell1",
            test: (result) => {
                if (result.length === 1) return "ok"
                else return JSON.stringify(result)
            }
        },
        {
            identifier: "cell4",
            test: (result) => {
                if (result.length === 1 && result[0].content === "This is the content of cell 4") return "ok"
                else return JSON.stringify(result)
            }
        },
    ]

    try {
        for (const { identifier, test } of data) {
            const response = await fetch(route + identifier)
            const message = await response.json()
            logger && logger.debug(`result: ${util.inspect(test(message))}`)
            result.push(test(message))
        }
    
        logger && logger.debug(result)
        
        logger && logger.debug(`final result:\n\n${result.join("\n")}`)
        return [ 200, result.join("\n") ]
    } catch (err) {
        console.log(util.inspect(err))
        throw throwBadRequestError()
    }

}

module.exports = {
    testGetAction
}