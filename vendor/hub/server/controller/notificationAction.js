const { assert } = require("../../../../core/api-utils")
const moment = require("moment")

const { select } = require("../../../flCore/server/model/select")
const { insert } = require("../../../flCore/server/model/insert")
const { updateColumns } = require("../../../flCore/server/post/updateColumns")

const { throwBadRequestError } = require("../../../../core/api-utils")

const notificationAction = async ({ req }, context, db) =>
{
    const entity = assert.notEmpty(req.params, "entity")
    const view = (req.query.view) ? req.query.view : "default"
    const config = context.config[`hub/notification/${entity}/${view}`]

    const connection = await db.getConnection()
    await connection.beginTransaction()
    //try {
        await notify({ context, entity, view }, connection)
        connection.commit()
        connection.release()
    // }
    // catch {
    //     await connection.rollback()
    //     connection.release()
    //     throw throwBadRequestError()
    // }
}

const notify = async ({ context, entity, view }, connection) =>
{
    const model = context.config[`${entity}/model`], table = model.entities[entity].table

    const [rules] = await connection.execute(select(context, table, null, { visibility: "active" }, null, null, model))
    for (let rule of rules) {
        await processRule({ context, entity, view }, connection, rule)
    }
}

const processRule = async ({ context, entity, view }, connection, rule) =>
{
    const templateModel = context.config["mkt_automation_template/model"], templateTable = templateModel.entities.mkt_automation_template.table
    const [[template]] = await connection.execute(select(context, templateTable, null, { id: rule.template_id }, null, null, templateModel))

    const model = context.config["crm_account/model"], table = model.entities.crm_account.table
    const where = {
        status: ["in"].concat(rule.status.split(",")), 
        callback_date: ["<=", moment().format("YYYY-MM-DD")]        
    }
    const columns = ["id", "contact_1_id", "n_first", "email", "tel_cell", "status", "callback_date"]
    const [contacts] = await connection.execute(select(context, table, columns, where, null, null, model))

    if (["smtp", "smtp+sms"].includes(rule.channel)) await registerSmtp({ context }, connection, rule, template, contacts)
    //if (["brevo", "brevo+sms"].includes(rule.channel)) await registerBrevo({ context }, connection, rule, template, contacts)
    if (["sms", "smtp+sms", "brevo+sms"].includes(rule.channel)) await registerSms({ context }, connection, rule, template, contacts)

    await updateContact({ context }, connection, rule, contacts)
}

const updateContact = async ({ context }, connection, rule, contacts) =>
{
    const columnsToUpdate = {}, pairs = {}
    for (const contact of contacts) pairs[contact.id] = rule.next
    columnsToUpdate.crm_account = { status: pairs }
    await updateColumns(context, columnsToUpdate, null, connection)
}

const registerSmtp = async ({ context }, connection, rule, template, contacts) =>
{
    /**
     * Save message to send
     */

    const type = "html"

    for (let row of contacts) {

        const mailData = {
            preHeader: template.email_subject,
            body: template.email_body,
            contact_1_id: row.contact_1_id,
            email: row.email
        }

        const email_body = []
        for (let split of template.email_body.split("{")) {
            const split2 = split.split("}")
            if (split2.length == 2) {
                let [propertyId, html] = split2
                if (propertyId == "prenom") propertyId = "n_first"
                email_body.push(`${ row[propertyId] }${html}`)
            }
            else email_body.push(split)
        }
        mailData.body = email_body.join("")

        let data = {
            status: "new",
            provider: "smtp",
            endpoint: "sendMail",
            method: "POST",
            params: JSON.stringify({ "type": type, "to": row.email, "subject": template.email_subject }),
            body: mailData.body,
            attachments: template.attachments
        }
        const [insertedRow] = (await connection.execute(insert(context, "interaction", data, context.config["interaction/model"])))
        row.insertId = insertedRow.insertId   

        /**
         * Insert a note
         */

        data = {
            status: "done",
            chanel: "email",
            direction: "outbound",
            account_id: row.id,
            summary: `${ context.translate("Email sent") } - ${template.email_subject}`
        }
        await connection.execute(insert(context, "crm_contact", data, context.config["crm_contact/model"]))
    }
}

const registerSms = async ({ context }, connection, rule, template, contacts) => {

    /**
     * Save message to send
     */

    let model
    for (let row of contacts) {

        model = context.config["interaction/model"]
        let body = []
        for (let split of template.sms.split("{")) {
            const split2 = split.split("}")
            if (split2.length == 2) {
                let [propertyId, rest] = split2
                if (propertyId == "prenom") propertyId = "n_first"
                body.push(`${ row[propertyId] }${rest}`)
            }
            else body.push(split)
        }
        body = body.join("")

        let data = {
            status: "new",
            provider: "smspartner.fr",
            endpoint: "/sms/json",
            method: "POST",
            params: JSON.stringify({ "from": "Double Cream", "text": body, "to": row.tel_cell })
        }
        const [insertedRow] = (await connection.execute(insert(context, "interaction", data, model)))
        row.insertId = insertedRow.insertId   

        /**
         * Insert a note
         */

        model = context.config["crm_contact/model"]
        data = {
            status: "done",
            chanel: "sms",
            direction: "outbound",
            account_id: row.id,
            summary: `${ context.translate("SMS sent") } - ${body}`
        }
        await connection.execute(insert(context, "crm_contact", data, model))
    }
}

module.exports = {
    notificationAction
}