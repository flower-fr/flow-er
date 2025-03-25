
const triggerEmailText = ({ context }) => {

    const formatLinks = function () {

        const html = [], rows = [], template = decodeURI($(`#${ $("#email_body").attr("data-fl-template") }`).val()), div = $("#email_body").attr("data-fl-div")
        
        let value
        $(".wysiwyg").each(function () { value = $(this).children(".wysiwyg-content").html().trim() })

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
            html.push(template.replaceAll("{addresses}", r.email.split(" ").join("")).replace("{body}", body.replaceAll("<p>", "").replaceAll("</p>", "%0D%0A%0D%0A").replace(/<\/?[^>]+(>|$)/g, "")).replace("{text}", body))
        }

        $(`#${div}`).html(html.join("\n"))
        $(".fl-email-template").click(function () {
            document.location = `mailto:${ $(this).attr("data-fl-addresses") }?body=${ $(this).attr("data-fl-body") }`
            $(this).prop("disabled", true)
        })
    }

    $(".fl-email-text").each(formatLinks)
    
    $(".fl-email-text").change(formatLinks)
}

export { triggerEmailText }