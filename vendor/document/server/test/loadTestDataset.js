const { throwBadRequestError } = require("../../../../core/api-utils")
const util = require("util")

const loadTestDataset = async ({ req }, context, { sql, logger }) => {
    req
    logger

    const data = {
        "document": [
            {
                type: "text",
                folder: "files",
                name: "file1",
                mime: "txt",
                version: "1.0",
                content_vector: "[0.1, 0.2, 0.3]",
            },
            {
                type: "text",
                folder: "files",
                name: "file2",
                mime: "txt",
                version: "1.0",
                content_vector: "[0.4, 0.5, 0.6]",
            },
            {
                type: "text",
                folder: "files",
                name: "file3",
                mime: "txt",
                version: "1.0",
                content_vector: "[0.7, 0.8, 0.9]",
            },
            {
                type: "text",
                folder: "files",
                name: "file4",
                mime: "txt",
                version: "1.0",
                content_vector: "[0.1, 0.2, 0.3]",
            }
        ],
        "document_cell": [
            {
                identifier: "cell1",
                document_id: 1,
                content: "This is the content of cell 1",
                row: 1,
                column: 1,
                state: "active",
                touched_at: "2026-02-25 08:00:00"
            },
            {
                identifier: "cell2",
                document_id: 1,
                content: "This is the content of cell 2",
                row: 1,
                column: 2,
                state: "active",
                touched_at: "2026-02-25 08:00:00"
            },
            {
                identifier: "cell3",
                document_id: 1,
                content: "This is the content of cell 3",
                row: 2,
                column: 1,
                state: "active",
                touched_at: "2026-02-25 08:00:00"
            },
            {
                identifier: "cell4",
                document_id: 1,
                content: "This is the content of cell 4",
                row: 2,
                column: 2,
                state: "active",
                touched_at: "2026-02-25 08:00:00"
            },
            {
                identifier: "cell1",
                document_id: 2,
                content: "This is the content of cell 1 after modification",
                row: 1,
                column: 1,
                state: "active",
                touched_at: "2026-02-25 09:00:00"
            },
            {
                identifier: "cell2",
                document_id: 2,
                content: "This is the content of cell 2 after modification",
                row: 1,
                column: 2,
                state: "active",
                touched_at: "2026-02-25 09:00:00"
            },
            {
                identifier: "cell3",
                document_id: 2,
                content: "This is the content of cell 3 after modification",
                row: 2,
                column: 1,
                state: "active",
                touched_at: "2026-02-25 09:00:00"
            },
            {
                identifier: "cell4",
                document_id: 2,
                content: "This is the content of cell 4 after modification but cancelled",
                row: 2,
                column: 2,
                state: "cancelled",
                touched_at: "2026-02-25 09:00:00"
            },
        ],
    }

    try {
        for (const entity in data) {
            for (const item of data[entity]) {
                logger && logger.debug(`Inserting the following values into the ${entity} table : ${util.inspect(item, { color: true, depth: null })}`)
                await sql.execute({ context, type: "insert", entity, data: item })
            }
        }
        return { success: true }
    } catch(err) {
        console.log(util.inspect(err))
        throw throwBadRequestError()
    }
    

}

module.exports = {
    loadTestDataset
}