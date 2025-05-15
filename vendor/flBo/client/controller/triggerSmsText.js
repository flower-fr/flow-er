
const triggerSmsText = (context, rows) => {

    const formatLinks = function () {

        const html = ["<h5>Envoyer manuellement</h5>"], value = $("#sms").val(), template = decodeURI($(`#${ $("#sms").attr("data-fl-template") }`).val()), div = $("#sms").attr("data-fl-div")

        if (!rows) {
            rows = []
            $(".fl-list-check").each(function () {
                if ($(this).prop("checked")) {
                    const checkData = $(this).attr("data-properties").split("|")
                    const row = {}
                    for (let pair of checkData) {
                        pair = pair.split(":")
                        row[pair[0]] = pair[1]
                    }
                    rows.push({ ...row })
                }
            })
        }
    
        const split = value.split("{")
        if (true) {

            /**
             * Separate links if the body is personnalized
             */

            for (const r of rows) {
                let body = []
                for (let s of split) {
                    const s2 = s.split("}")
                    if (s2.length == 2) {
                        let [propertyId, rest] = s2
                        if (propertyId == "prenom") propertyId = "n_first"
                        body.push(`${ r[propertyId] }${rest}`)
                    }
                    else body.push(s)
                }
                body = body.join("")

                const addresses = (r.tel_cell) ? r.tel_cell.split(" ").join("") : context.translate("Missing phone")
                const disabled = (r.tel_cell) ? "" : "disabled"
                html.push(template.replaceAll("{addresses}", addresses).replace("{disabled}", disabled).replace("{body}", body).replace("{text}", body))
            }
        }
        else {

            /**
             * Grouped SMS if same text for all
             */

            const addresses = []
            for (const r of rows) addresses.push(r.tel_cell.split(" ").join(""))
            html.push(template.replace("{addresses}", addresses.join(",")).replace("{body}", value).replace("{text}", value))
        }

        $(`#${div}`).html(html.join("\n"))
        $(".fl-sms-template").click(function () {
            document.location = `sms:${ $(this).attr("data-fl-addresses") }&body=${ $(this).attr("data-fl-body") }`
            $(this).prop("disabled", true)
        })
    }

    $(".fl-sms-text").each(formatLinks)
    
    $(".fl-sms-text").change(formatLinks)
}

export { triggerSmsText }