const { throwBadRequestError } = require("../../../../core/api-utils")
const util = require("util")

const { demoContent } = require("./loadTestDatasetV2.js")

const testPostAction = async ({ req }, context, { logger }) => {
    req

    const route = "http://0.0.0.0:5010/document/v1/document_cell", result = []
    const data = demoContent

    try {
        for (const body of data) {
            logger && logger.debug(`sending body: ${util.inspect(JSON.stringify(body))}`)
            const response = await fetch(`${route}/1`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            })
            const message = await response.json()
            logger && logger.debug(`result: ${util.inspect(message.response)}`)
            result.push(message.response)
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
    testPostAction
}