const { throwBadRequestError } = require("../../../../core/api-utils")
const util = require("util")

const testGetAction = async ({ req }, context, { logger }) => {
    const jwt = req.query.jwt

    const route = "http://0.0.0.0:5010/document/v1/document_cell", result = []
    const data = [
        {
            identifier: "",
            test: (result) => {
                console.log("dans test")
                if (result.length === 54) return "ok"
                else return "erreur : le nombre de cellules retournées n'est pas correct"
            }
        },
        {
            identifier: 1,
            test: (result) => {
                if (result.length === 1) return "ok"
                else return JSON.stringify(result)
            }
        },
        {
            identifier: 50,
            test: (result) => {
                if (result.length === 1 && result[0].content.test === "modified") return "ok"
                else return JSON.stringify(result)
            }
        },
    ]

    try {
        for (const { identifier, test } of data) {
            const response = await fetch(`${route}/1/${identifier}?jwt=${jwt}`)
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