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
                content_vector: [0.1, 0.2, 0.3],
            },
            {
                type: "text",
                folder: "files",
                name: "file2",
                mime: "txt",
                version: "1.0",
                content_vector: [0.4, 0.5, 0.6],
            },
            {
                type: "text",
                folder: "files",
                name: "file3",
                mime: "txt",
                version: "1.0",
                content_vector: [0.7, 0.8, 0.9],
            },
            {
                type: "text",
                folder: "files",
                name: "file4",
                mime: "txt",
                version: "1.0",
                content_vector: [0.1, 0.2, 0.3],
            }
        ],
        "document_cell": [
            {
                "identifier": "cell1",
                "document_id": 1,
                "content": "This is the content of cell 1",
                "row": 1,
                "column": 1
            },
            {
                "identifier": "cell2",
                "document_id": 1,
                "content": "This is the content of cell 2",
                "row": 1,
                "column": 2
            },
            {
                "identifier": "cell3",
                "document_id": 1,
                "content": "This is the content of cell 3",
                "row": 2,
                "column": 1
            },
            {
                "identifier": "cell4",
                "document_id": 1,
                "content": "This is the content of cell 4",
                "row": 2,
                "column": 2
            },
            {
                "identifier": "cell5",
                "document_id": 2,
                "content": "This is the content of cell 5",
                "row": 1,
                "column": 1
            },
            {
                "identifier": "cell6",
                "document_id": 2,
                "content": "This is the content of cell 6",
                "row": 1,
                "column": 2
            },
            {
                "identifier": "cell7",
                "document_id": 2,
                "content": "This is the content of cell 7",
                "row": 2,
                "column": 1
            },
            {
                "identifier": "cell8",
                "document_id": 2,
                "content": "This is the content of cell 8",
                "row": 2,
                "column": 2
            },
        ],
    }

    try {
        for (const entity in data) {
            const values = data[entity]
            await sql.execute({ context, type: "insert", entity, values })
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