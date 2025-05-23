
const triggerEmailText = ({ context }, rows) => {

    const formatLinks = function () {

        const html = ["<h5>Envoyer manuellement</h5>"], template = decodeURI($(`#${ $("#email_body").attr("data-fl-template") }`).val()), div = $("#email_body").attr("data-fl-div")
        
        const subject = $("#email_subject").val()

        let value
        $(".wysiwyg").each(function () { value = $(this).children(".wysiwyg-content").html().trim() })

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

        /**
         * Separate links with personalized body
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
            html.push(template.replaceAll("{addresses}", decodeURIComponent(r.email).split(" ").join("")).replace("{subject}", subject).replace("{body}", body.replaceAll("<p>", "").replaceAll("</p>", "%0D%0A%0D%0A").replace(/<\/?[^>]+(>|$)/g, "")).replace("{text}", body))
        }

        $(`#${div}`).html(html.join("\n"))
        $(".fl-email-template").click(function () {
            document.location = `mailto:${ $(this).attr("data-fl-addresses") }?subject=${ $(this).attr("data-fl-subject") }&body=${ $(this).attr("data-fl-body") }`
            $(this).prop("disabled", true)
        })
    }

    $(".fl-email-text").each(formatLinks)
    
    $(".fl-email-text").change(formatLinks)
}

export { triggerEmailText }