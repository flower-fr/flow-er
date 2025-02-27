const fs = require("fs");
const xlsxParser = require("node-xlsx").default
const multer = require("multer")
const { authTokenMiddleware } = require("../../../auth/index")
const { getTokenPayload } = require("../../../../core/tools/security")
const { createDbClient } = require("../../../utils/db-client")
const { createMailClient } = require("../../../utils/mail-client")
const { createXlsxClient } = require("../../../utils/xlsx-client")
const { createPdfClient } = require("../../../utils/pdf-client")
const { executeService, assert } = require("../../../../core/api-utils")

const { getImportXlsxAction, postImportXlsxAction } = require("./importXlsxAction")
const { getImportCsvAction, postImportCsvAction } = require("./importCsvAction")

const registerHub = async ({ context, config, logger, app }) => {
    const db = await createDbClient(config.db, context.dbName)
    const mailClient = createMailClient({ config: config.smtp, logger })
    const xlsxClient = createXlsxClient({ logger })
    const pdfClient = createPdfClient({ logger })

    const execute = executeService(context.clone(), config, logger)
    const executeImportXlsx = async (req, res) => {
        if (!context.isAllowed("interaction")) return res.status(403).send({message: "unauthorized"})
        const result = await postImportXlsxAction({ req }, context, db)
        return res.status(200).send(result)
    }
    const executeImportCsv = async (req, res) => {
        if (!context.isAllowed("interaction")) return res.status(403).send({message: "unauthorized"})
        const result = await postImportCsvAction({ req }, context, db)
        return res.status(200).send(result)
    }
    const upload = multer()
    //app.use(`${config.prefix}`, authTokenMiddleware(config, context))
    
    app.get(`${config.prefix}send`, execute(getAction, context, db))
    app.post(`${config.prefix}send`, execute(postAction, context, db))
    app.get(`${config.prefix}send-mail`, execute(sendMailAction, context, mailClient))
    app.get(`${config.prefix}xlsx`, execute(xlsxAction, context, xlsxClient))
    app.get(`${config.prefix}import-xlsx/:entity`, execute(getImportXlsxAction, context, db))
    app.post(`${config.prefix}import-xlsx/:entity/:id`, upload.single("global-xlsxFile"), executeImportXlsx)
    app.get(`${config.prefix}import-csv/:entity`, execute(getImportCsvAction, context, db))
    app.post(`${config.prefix}import-csv/:entity/:id`, upload.single("global-csvFile"), executeImportCsv)
    app.get(`${config.prefix}pdf`, execute(pdfAction, context, pdfClient))
}

const getAction = async ({ req }, context, db) => {
    const endpoint = assert.notEmpty(req.params, "endpoint")
    const endpointConfig = context.config[`interaction/${endpoint}/get`]
}

const postAction = async ({ req }, context, db) => {
    const endpoint = assert.notEmpty(req.params, "endpoint")
    const endpointConfig = context.config[`interaction/${endpoint}/post`]
}

const sendMailAction = async ({ req }, context, mailClient) => {
    await mailClient.sendMail({
        type: "html",
        to: "bruno@lartillot.net",
        subject: "Test emailing",
        content: `Bonjour,
        Contenu du message...`
    })
}

const xlsxAction = async ({ req }, context, xlsxClient) => {
    await xlsxClient.xlsx(
        {
            A2: { t: "s", v: "John" },
            B2: { t: "s", v: 1000 },
            C2: { t: "d", v: "2024-11-03" },
            A3: { t: "s", v: "Jack" },
            B3: { t: "n", v: 2000 },
            C3: { t: "d", v: "2024-11-04" },
            A1: { v: "Nom", t: "s", s: { font: { sz: 24, bold: true, color: { rgb: "FFFFAA00" } } } },
            B1: { v: "Montant", t: "s" },
            C1: { v: "Date", t: "s" },
            "!cols": [{ wch: 12 }, { wch: 12 }, { wch: 12 }],
            "!ref": "A1:C3"
        }
    )
}

const pdfAction = async ({ req }, context, pdfClient) => {
    await pdfClient.pdf()
}

module.exports = {
    registerHub
}