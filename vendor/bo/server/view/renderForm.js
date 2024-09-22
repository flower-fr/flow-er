const moment = require("moment")

const renderForm = ({ context, entity, view} , { properties, where, formJwt }) => {

    const renderSection = () => {

        let addConfig = context.config[`${entity}/form/${view}`]
        const html = ["<div class=\"row\">"]

        for (let sectionId of Object.keys(addConfig.layout)) {
            const section = addConfig.layout[sectionId]
            if (section.labels) {
                html.push(`<div class="col-lg-12">
                    <h5 id="${sectionId}" class="text-center mb-4">${ context.localize(section.labels) }</h5>
                </div>`)
            }
            html.push(renderProperty(section.properties))
        }

        html.push("</div>")

        return html.join("\n")
    }

    const renderProperty = (section) => {

        const html = []

        for (let propertyId of section) {
            const property = properties[propertyId]
            const options = property.options
            const label = (options.labels) ? context.localize(options.labels) : context.localize(property.labels)
            const propertyType = (options.type) ? options.type : property.type
            const immutable = (property.options.immutable) ? true : false
            const mandatory = (property.options.mandatory) ? true : false

            html.push(`<div class="${ (options.class) ? options.class : col-lg-12 }">`)

            let currentDate = new Date()
            const year = currentDate.getFullYear(), month = String(currentDate.getMonth() + 1).padStart(2, "0"), day = String(currentDate.getDate()).padStart(2, "0")
            currentDate = `${year}-${month}-${day}`

            let value = ""
            if (options.value && !Array.isArray(options.value)) {
                value = options.value
                if (value && value.charAt(5) == "+") value = moment().add(value.substring(6), "days").format("YYYY-MM-DD")
                else if (value && value.charAt(5) == "-") value = moment().subtract(value.substring(6), "days").format("YYYY-MM-DD")
                else value = moment().format("YYYY-MM-DD")    
            }
            if (options.initialValue) {
                value = options.initialValue
                if (value && value.charAt(5) == "+") value = moment().add(value.substring(6), "days").format("YYYY-MM-DD")
                else if (value && value.charAt(5) == "-") value = moment().subtract(value.substring(6), "days").format("YYYY-MM-DD")
                else value = moment().format("YYYY-MM-DD")    
            }
    
            else if (propertyId == "bank_identifier") {
                html.push(`<div class="form-group">
                    <input type="text" class="form-control updateIban" name="${propertyId}" value="" placeholder="${ (mandatory) ? "* " : "" } ${label}" class="wpcf7-form-control wpcf7-text" aria-invalid="false" ${ (mandatory) ? "required" : "" } maxlength="255">
                </div>`)
            }
    
            else if (propertyType == "input") {
                html.push(`<div class="form-group">
                    <input type="text" class="form-control" name="${propertyId}" value="" placeholder="${ (mandatory) ? "* " : "" } ${label}" class="wpcf7-form-control wpcf7-text" aria-invalid="false" ${ (mandatory) ? "required" : "" } maxlength="255">
                </div>`)
            }
    
            else if (propertyType == "email") {
                html.push(`<div class="form-group">
                    <input type="text" class="form-control updateEmail" name="${propertyId}" value="" placeholder="${ (mandatory) ? "* " : "" } ${label}" class="wpcf7-form-control wpcf7-text" aria-invalid="false" ${ (mandatory) ? "required" : "" } maxlength="255">
                </div>`)
            }
    
            else if (propertyType == "phone") {
                html.push(`<div class="form-group">
                    <input type="text" class="form-control updatePhone" name="${propertyId}" value="" placeholder="${ (mandatory) ? "* " : "" } ${label}" class="wpcf7-form-control wpcf7-text" aria-invalid="false" ${ (mandatory) ? "required" : "" } maxlength="255">
                </div>`)              
            }
        
            else if (["date", "datetime", "closing_date"].includes(propertyType)) {
                html.push(`<div class="form-group">
                    <input type="text" class="form-control updateDate" name="${propertyId}" value="" placeholder="${ (mandatory) ? "* " : "" } ${label}" class="wpcf7-form-control wpcf7-text" aria-invalid="false" ${ (mandatory) ? "required" : "" } maxlength="255">
                </div>`)
            }
    
            else if (propertyType == "birth_year") {
                html.push(`<div class="form-group">
                    <label class="col-sm-5 col-form-label col-form-label-sm">${(mandatory) ? "* " : ""}${label}</label>
                    <div class="col-sm-7">
                        <select class="form-control form-control-sm updateBirthYear" id="${propertyId}" ${(mandatory) ? "required" : ""}>
                            <option />
                            ${() => { for (let year = 1950; year < new Date.getFullYear(); year++) `<option value="${year}" ${(value == year) ? "selected=\"selected\"" : ""}>${year}</option>` }}
                        </select>
                    </div>
                </div>`)
            }

            else if (propertyType == "time") {
                html.push(`<div class="form-group">
                <input type="text" class="form-control updateTime" name="${propertyId}" value="" placeholder="${ (mandatory) ? "* " : "" } ${label}" class="wpcf7-form-control wpcf7-text" aria-invalid="false" ${ (mandatory) ? "required" : "" } maxlength="255">
            </div>`)              
            }
    
            else if (propertyType == "number") {
                html.push(`<div class="form-group">
                <input type="text" class="form-control updateNumber" name="${propertyId}" value="" placeholder="${ (mandatory) ? "* " : "" } ${label}" class="wpcf7-form-control wpcf7-text" aria-invalid="false" ${ (mandatory) ? "required" : "" } maxlength="255">
            </div>`)
            }
    
            else if (propertyType == "textarea") {
                html.push(`<div class="form-group row">
                    <label class="col-sm-5 col-form-label col-form-label-sm">${(mandatory) ? "* " : ""}${label}</label>
                    <div class="col-sm-7">
                        <textarea class="form-control form-control-sm updateTextarea" rows="5" id="${propertyId}" ${(mandatory) ? "* " : ""}${label} maxlength="${(property.options.max_length) ? property.options.max_length : 2047}">${value}</textarea>
                        <div class="invalid-feedback text-danger" id="inputError-${propertyId}">${context.translate("The input is too long")}</div>
                    </div>
                </div>`)
            }

            else if (propertyType == "select") {
                const multiple = property.multiple
                const values = (value) ? value.split(",") : []
                html.push(`<div class="form-group" id="updateSelectDiv-${propertyId}">
                    <label class="col-sm-5 col-form-label col-form-label-sm">${(mandatory) ? "* " : ""}${label}</label>
                    <div class="col-sm-7">            
                        <select class="${(!multiple) ? "form-control form-control-sm" : ""} updateSelect" id="${propertyId}" ${(multiple) ? "multiple" : ""} ${(mandatory) ? "required" : ""}>
                            <option />
    ${function () {
        const restriction = (property.options.restriction) ? property.options.restriction : {}
        const html = []
        for (let key of Object.keys(property.modalities)) {
            let keep = true
            if (restriction[key]) {
                for (let filterId of Object.keys(restriction[key])) {
                    if (where[filterId]) {
                        if (restriction[key][filterId] && !restriction[key][filterId].includes(where[filterId][0])) keep = false
                    }
                }
            }
            const labels = property.modalities[key]
            let selectable = true
            if (!values[key] && labels.archive) selectable = false                
            if (selectable && keep) {
                html.push(`<option value="${key}" ${(values.includes(key)) ? "selected" : ""} ${(labels.archive) ? "disabled" : ""}>${context.localize(labels)}</option>`)
            }
        }
        return html.join("\n")
    } ()}
                        </select>            
                    </div>
                </div>`)
            }
        
            else if (propertyType == "multiselect") {
                const values = (value) ? value.split(",") : []
                html.push(`<input type="hidden" class="updateSelectedValue" id="updateSelectedValue-${propertyId}" />
                    <div class="form-group" id="updateSelectDiv-${propertyId}">
                        <label class="col-sm-5 col-form-label col-form-label-sm">${(mandatory) ? "* " : ""}${label}</label>
                        <div class="col-sm-7">
                            ${(property.modalities) ?
        `<select class="selectpicker updateSelectpicker updateSelect" id="${propertyId}" multiple>
                                    ${function () {
        const html = []
        for (let key of Object.keys(property.modalities)) {
            const labels = property.modalities[key]
            html.push(`<option value="${key}" ${(values.includes(key)) ? "selected" : ""}>${context.localize(labels)}</option>`)
        }
        return html.join("\n")
    } ()}
                                </select>` : ""}
                        </div>
                    </div>`)
            }
    
            else if (propertyType == "tag") {
                html.push(`<div class="form-group" id="updateSelectDiv-${propertyId}">
                    <label class="col-sm-5 col-form-label col-form-label-sm">${(mandatory) ? "* " : ""}${label}</label>
                    <div class="col-sm-7 selectTags" id="selectTags-${propertyId}">
                        ${`<select class="form-control form-control-sm selectpicker updateSelectpicker updateSelect" id="${propertyId}" multiple data-none-selected-text>
                            <option />
    ${function () {
        const html = []
        for (let tag of property.tags) {
            const vectorId = property.vector
            const ids = tag[vectorId]
            const tagKey = (property.key) ? property.key : "id"
            const selected = false
            html.push(`<option value="${tag.id}" ${(selected) ? "selected" : ""}>${tag.name}</option>`)
        }
        return html.join("\n")
    } ()}
                        </select>`}
                    </div>
                </div>`)
            }
    
            else if (propertyType == "source") {
                html.push(`<div class="form-group" id="updateSelectDiv-${propertyId}">
                    <label class="col-sm-5 col-form-label col-form-label-sm">${(mandatory) ? "* " : ""}${label}</label>
                    <div class="col-sm-7">
                        ${`<select class="form-control form-control-sm updateSelect" id="${propertyId}">
                            <option />
    ${function () {
        const restriction = (property.options.restriction) ? property.options.restriction : {}
        const html = []
        for (let modalityId of Object.keys(property.modalities)) {
            let keep = true
            if (restriction[modalityId]) {
                for (let filterId of Object.keys(restriction[modalityId])) {
                    if (where[filterId]) {
                        if (restriction[modalityId][filterId] && !restriction[modalityId][filterId].includes(where[filterId][0])) keep = false
                    }
                }
            }
            const modality = property.modalities[modalityId]
            if (keep) {
                html.push(`<option value="${modalityId}" ${(value == modalityId) ? "selected" : ""}>${modality}</option>`)
            }
        }
        return html.join("\n")
    } ()}
                        </select>`}
                    </div>
                </div>`)
            }

            else if (propertyType == "history") {          

                html.push(`<div class="form-group">
                    <div>${label}</div>
                    <textarea class="form-control form-control-sm updateTextarea" id="${propertyId}" ${(mandatory) ? "required" : ""} maxlength="${(property.options.max_length) ? property.options.max_length : 65535}"></textarea>
                    <input type="hidden" id="updateHistoryRoute-${propertyId}" value="/bo/history/${property.entity}/1" />
                    <div class="invalid-feedback text-danger" id="updateError-${propertyId}"></div>
                </div>`)
            }

            else {
                html.push(`<div class="form-group">
                <input type="text" class="form-control updateInput" name="${propertyId}" value="" placeholder="${ (mandatory) ? "* " : "" } ${label}" class="wpcf7-form-control wpcf7-text" aria-invalid="false" ${ (mandatory) ? "required" : "" } maxlength="255">
            </div>`)
            }

            html.push("</div>")
        }

        return html.join("\n")
    }

    const html = [`<!DOCTYPE html>
    <html lang="fr">

    <head>
        <title>Do the right move - Contact</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

        <link rel="preconnect" href="https://fonts.gstatic.com">
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500;600;700;800;900&display=swap" rel="stylesheet">

        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/ionicons/4.5.6/css/ionicons.min.css">

        <link rel="stylesheet" href="/dtrm/cli/resources/css/animate.css">
        <link rel="stylesheet" href="/dtrm/cli/resources/css/flaticon.css">
        <link rel="stylesheet" href="/dtrm/cli/resources/css/tiny-slider.css">
        <link rel="stylesheet" href="/dtrm/cli/resources/css/glightbox.min.css">
        <link rel="stylesheet" href="/dtrm/cli/resources/css/aos.css">
        <link rel="stylesheet" href="/dtrm/cli/resources/css/style.css">

        <script src="https://www.google.com/recaptcha/enterprise.js?render=6LewVNcpAAAAAI1Wo8s3o2SlmnPuCVoBu5w-rSaz"></script>

    </head>

    <body style="background: #fff">`]

    html.push(`<form method="post" id="customForm" class="contactForm" enctype="multipart/form-data">
        <input id="lead_origin" type="hidden" name="p_pit-identifier" value="">
        <div class="row">
            ${renderSection()}

            <div class="col-lg-12">
                <div class="form-group">
                    <input type="checkbox" name="p_pit-optin" required></input>
                    &nbsp;&nbsp;
                    <label>J’accepte d’être recontacté</label>
                </div>
            </div>
            <div class="col-lg-12">
                <div class="form-group">
                    <div class="g-recaptcha" data-sitekey="your_site_key"></div>
                </div>
            </div>

        </div>
        <div class="col-md-12">
            <div class="form-group">

                <input type="submit" value="Envoyer" class="btn btn-primary">

            </div>
        </div>
    </form>`)

    html.push(`</body>
            
    <script src="js/bootstrap.bundle.min.js"></script>
    <script src="js/tiny-slider.js"></script>
    <script src="js/glightbox.min.js"></script>
    <script src="js/aos.js"></script>
    <script src="js/rellax.min.js"></script>
    <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBVWaKrjvy3MaE7SQ74_uJiULgl1JY0H2s&sensor=false"></script>
    <script src="js/google-map.js"></script>
    <script src="js/main.js"></script>
    <script>
    function onClick(e) {
      e.preventDefault();
      grecaptcha.enterprise.ready(async () => {
        const token = await grecaptcha.enterprise.execute('6LewVNcpAAAAAI1Wo8s3o2SlmnPuCVoBu5w-rSaz', {action: 'LOGIN'});
      });
    }
    </script>
    </html>`)

    return html.join("\n")
}

module.exports = {
    renderForm
}