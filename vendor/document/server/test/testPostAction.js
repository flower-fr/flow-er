const { throwBadRequestError } = require("../../../../core/api-utils")
const util = require("util")

const testPostAction = async ({ req }, context, { logger }) => {
    req

    const route = "http://0.0.0.0:5010/document/v1/document/", result = []
    const data = [
        {
            body: {
                identifier: "cell1",
                document_id: 1,
                content: "This is the content of cell 1",
                row: 1,
                column: 1,
                state: "active",
                touched_at: "2026-02-25 08:00:00"
            },
            test: (result) => {
                console.log(result)
            }
        },
        {
            body: {
                identifier: "cell2",
                document_id: 1,
                content: "This is the content of cell 2",
                row: 1,
                column: 2,
                state: "active",
                touched_at: "2026-02-25 08:00:00"
            },
            test: (result) => {
                console.log(result)
            }
        },
        {
            body: {
                identifier: "cell3",
                document_id: 1,
                content: "This is the content of cell 3",
                row: 2,
                column: 1,
                state: "active",
                touched_at: "2026-02-25 08:00:00"
            },
            test: (result) => {
                console.log(result)
            }
        },
        {
            body: {
                identifier: "cell4",
                document_id: 1,
                content: "This is the content of cell 4",
                row: 2,
                column: 2,
                state: "active",
                touched_at: "2026-02-25 08:00:00"
            },
            test: (result) => {
                console.log(result)
            }
        },
        {
            body: {
                identifier: "cell1",
                document_id: 2,
                content: "This is the content of cell 1 after modification",
                row: 1,
                column: 1,
                state: "active",
                touched_at: "2026-02-25 09:00:00"
            },
            test: (result) => {
                console.log(result)
            }
        },
        {
            body: {
                identifier: "cell2",
                document_id: 2,
                content: "This is the content of cell 2 after modification",
                row: 1,
                column: 2,
                state: "active",
                touched_at: "2026-02-25 09:00:00"
            },
            test: (result) => {
                console.log(result)
            }
        },
        {
            body: {
                identifier: "cell3",
                document_id: 2,
                content: "This is the content of cell 3 after modification",
                row: 2,
                column: 1,
                state: "active",
                touched_at: "2026-02-25 09:00:00"
            },
            test: (result) => {
                console.log(result)
            }
        },
        {
            body: {
                identifier: "cell4",
                document_id: 2,
                content: "This is the content of cell 4 after modification but cancelled",
                row: 2,
                column: 2,
                state: "cancelled",
                touched_at: "2026-02-25 09:00:00"
            },
            test: (result) => {
                console.log(result)
            }
        },
    ]

    try {
        for (const { body, test } of data) {
            logger && logger.debug(`sending body: ${util.inspect(JSON.stringify(body))}`)
            const response = await fetch(route, {
                method: "POST",
                body: JSON.stringify(body)
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
    testPostAction
}