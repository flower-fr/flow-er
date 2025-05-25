const moment = require("moment")

const sendSms = async ({ rows, smsClient }) => 
{
    /**
     * Send the batch of sms
     */

    const body = { apiKey: smsClient.apiSecret, sender: smsClient.sender, SMSList: [] }
    if (smsClient.sandbox) body.sandbox = 1
    for (let row of rows)
    {
        if (!row.scheduled_at || moment(row.scheduled_at).format("YYYY-MM-DD HH:mm:ss") < moment().format("YYYY-MM-DD HH:mm:ss")) {
            const rowBody = JSON.parse(row.body)
            body.SMSList.push(rowBody.SMSList[0])
        }
    }

    console.log(await fetch("https://api.smspartner.fr/v1/bulk-send", {
        method: "POST",
        headers: new Headers({"content-type": "application/json"}),
        body: JSON.stringify(body)
    }))
}

module.exports = {
    sendSms
}