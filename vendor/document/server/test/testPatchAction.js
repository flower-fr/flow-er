const { throwBadRequestError } = require("../../../../core/api-utils")
const util = require("util")

const testPatchAction = async ({ req }, context, { sql, logger }) => {
    req
    sql

    const route = "http://0.0.0.0:5010/document/v1/document_cell", result = []
    const data = [
        {
            action: "undo",
            test: (result) => {
                console.log("dans test")
                if (result == {"response":"cellule insérée avec succès"}) return "ok"
                else return JSON.stringify(result)
            }
        },
        {
            action: "redo",
            test: (result) => {
                if (result == {"response":"cellule insérée avec succès"}) return "ok"
                else return JSON.stringify(result)
            }
        },
    ]

    try {
        for (const { action, test } of data) {
            const response = await fetch(`${route}/1/${action}`, {
                method: "PATCH",
            })
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
    testPatchAction
}