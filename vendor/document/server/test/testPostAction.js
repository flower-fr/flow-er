const { throwBadRequestError } = require("../../../../core/api-utils")
const util = require("util")

const { demoContent } = require("./loadTestDatasetV2.js")

const testPostAction = async ({ req }, context, { logger }) => {
    const jwt = req.query.jwt

    let route = `http://0.0.0.0:5010/core/v1/document?jwt=${jwt}`, result = []
    let data = demoContent.document

    try {
        const body = [data]
        logger && logger.debug(`sending body: ${util.inspect(JSON.stringify(body))}`)
        const response = await fetch(`${route}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        })
        if (response.status !== 200) {
            logger && logger.debug(`response status: ${response.status}`)
            const errorMessage = await response.text()
            logger && logger.debug(`error message: ${errorMessage}`)
            throw new Error(`Request failed with status ${response.status}: ${errorMessage}`)
        }
        
        const message = await response.json()
        logger && logger.debug(`result: ${util.inspect(message.response)}`)
        result.push(message.response)
    
        logger && logger.debug(result)
        
        logger && logger.debug(`final result:\n\n${result.join("\n")}`)
    } catch (err) {
        console.log(util.inspect(err))
        throw throwBadRequestError()
    }

    route = "http://0.0.0.0:5010/document/v1/document_cell", result = []
    data = demoContent.cells

    try {
        for (const body of data) {
            logger && logger.debug(`sending body: ${util.inspect(JSON.stringify(body))}`)
            const response = await fetch(`${route}/1?jwt=${jwt}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            })
            if (response.status !== 200) {
                logger && logger.debug(`response status: ${response.status}`)
                const errorMessage = await response.text()
                logger && logger.debug(`error message: ${errorMessage}`)
                throw new Error(`Request failed with status ${response.status}: ${errorMessage}`)
            }
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