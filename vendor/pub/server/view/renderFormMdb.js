const moment = require("moment")
const { renderSsrMdb } = require("./renderSsrMdb")

const extractParams = (params, param, mapping) => {
    const result = []
    for (let key of Object.keys(params)) {
        const value = params[key]
        if (!param) result.push(`${key}=${value}`)
        else if (param == key) {
            if (mapping) result.push(mapping[value])
            else result.push(value)
        }
    }
    return result.join("&")
}

const computeValue = (expression, closedDays = false, format = "YYYY-MM-DD") => {
    if (expression.includes("today")) {
        if (expression.includes("+") || expression.includes("-")) {
            const opened = ((expression.charAt(6) == "o")) ? true : false
            const shift = parseInt((opened) ? expression.substring(7) : expression.substring(6))
            let shifted = moment().locale("fr")
            for (let i = 0; i < shift; i++) {
                if (expression.charAt(5) == "+") {
                    shifted = shifted.add(1, "days")
                    if (closedDays) for (let closed of closedDays) if (shifted.format("YYYY-MM-DD") == closed) {
                        shifted = shifted.add(1, "days")
                        break
                    }
                    if (opened) {
                        if (shifted.day() == 6) shifted = shifted.add(2, "days")
                        else if (shifted.day() == 0) shifted = shifted.add(1, "days")
                    }
                    if (closedDays) for (let closed of closedDays) if (shifted.format("YYYY-MM-DD") == closed) {
                        shifted = shifted.add(1, "days")
                        break
                    }
                }
                else if (expression && expression.charAt(5) == "-") {
                    shifted = shifted.subtract(1, "days")
                    if (closedDays) for (let closed of closedDays) if (shifted.format("YYYY-MM-DD") == closed) {
                        shifted = shifted.subtract(1, "days")
                        break
                    }
                    if (opened) {
                        if (shifted.day() == 6) shifted = shifted.subtract(2, "days")
                        else if (shifted.day() == 0) shifted = shifted.subtract(1, "days")
                    }
                    if (closedDays) for (let closed of closedDays) if (shifted.format("YYYY-MM-DD") == closed) {
                        shifted = shifted.subtract(1, "days")
                        break
                    }
                }                    
            }
            return shifted.format(format)
        }
        else return moment().format(format)        
    }
    else return expression
}

const renderFormMdb = ({ context, entity, view} , data) => {

    const properties = data.properties
    const config = data.formConfig
    const closedDays = config.options && config.options.closedDays 

    const renderHidden = (hiddenPart) => {

        const html = []

        for (let propertyId of hiddenPart) {
            const property = properties[propertyId]
            const options = property.options

            let value = ""
            if (options.value && !Array.isArray(options.value)) {
                if (options.value == "query") {
                    value = extractParams(data.params, options.param, options.mapping)
                    if (!value && options.default) value = options.default
                }
                else value = computeValue(options.value, closedDays)
            }

            html.push(`<input type="hidden" class="property updateInput" id="${propertyId}" value="${value}" />`)
        }

        return html.join("\n")
    }

    const html = []

    html.push(`

    <div class="container">
    <form method="post" id="customForm" class="contactForm" enctype="multipart/form-data">
        <input id="lead_origin" type="hidden" name="flower-identifier" value="">
        <div class="row mt-3">
            ${ renderSsrMdb({ context, entity, view }, data) }
        </div>

        <div class="row mt-2" id="csr"></div>

        ${ (config["hidden"]) ? renderHidden(config["hidden"]) : "" }
 
        <div class="updateMessage" id="updateMessageOk">
            <div class="alert alert-success my-3 text-center">${context.translate("Your request has been registered")}</div>
        </div>

        <div class="updateMessage" id="updateMessageExpired">
            <div class="alert alert-danger my-3 text-center">${context.translate("The form has expired, please input again")}</div>
        </div>

        <div class="updateMessage" id="updateMessageServerError">
            <div class="alert alert-danger my-3 text-center">${context.translate("A technical error has occured. PLease try again later")}</div>
        </div>

        <div class="col-md-12">
            <div class="form-group">

                <input type="submit" value="Envoyer" class="updateSubmit ${ (config.layout.submit) ? config.layout.submit.class : ""}">

            </div>
        </div>
    </form>
    </div>`)

    return html.join("\n")
}

module.exports = {
    renderFormMdb
}
