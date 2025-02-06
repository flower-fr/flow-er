
const triggerSmsText = () => {

    $(".fl-sms-text").change(function () {

        const html = [], rows = [], value = $(this).val(), template = decodeURI($(`#${ $(this).attr("data-fl-template") }`).val()), div = $(this).attr("data-fl-div")

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
    
        const split = value.split("{")
        if (split.length > 1) {

            /**
             * Separate links if the body is personnalized
             */

            for (const r of rows) {
                let body = []
                for (let s of split) {
                    const s2 = s.split("}")
                    if (s2.length == 2) {
                        const [propertyId, rest] = s2
                        body.push(`${ r[propertyId] }${rest}`)
                    }
                    else body.push(s)
                }
                body = body.join("")

                html.push(template.replace("{addresses}", r.tel_cell.split(" ").join("")).replace("{body}", body).replace("{text}", body))
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
    })
}

