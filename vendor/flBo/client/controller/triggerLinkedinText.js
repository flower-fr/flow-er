
const triggerLinkedinText = (context, rows) => {

    const formatLinks = function () {

        const html = ["<h5>Envoyer manuellement</h5>"], value = $("#description").val(), template = decodeURI($(`#${ $("#description").attr("data-fl-template") }`).val()), div = $("#description").attr("data-fl-div")

        if (!rows) {
            rows = []
            $(".fl-list-check").each(function () {
                if ($(this).prop("checked")) {
                    const checkData = $(this).attr("data-properties").split("|")
                    const row = {}
                    for (let pair of checkData) {
                        pair = pair.split(":")
                        row[pair[0]] = decodeURIComponent(pair[1])
                    }
                    rows.push({ ...row })
                }
            })
        }
    
        const split = value.split("{")

        for (const r of rows) {
            if (r.linkedin) {
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
    
                const addresses = decodeURIComponent(r.linkedin)
                const disabled = (r.linkedin) ? "" : "disabled"
                html.push(template.replaceAll("{addresses}", addresses).replace("{disabled}", disabled).replace("{body}", body).replace("{text}", body))    
            }
        }

        $(`#${div}`).html(html.join("\n"))
        $(".fl-linkedin-template").click(function () {
            navigator.clipboard.writeText($(this).attr("data-fl-body"))
            $(this).addClass("disabled")
        })
    }

    $(".fl-linkedin-text").each(formatLinks)
    
    $(".fl-linkedin-text").change(formatLinks)
}

export { triggerLinkedinText }