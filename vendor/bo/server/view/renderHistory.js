const renderHistory = (context, entity, view, id, rows) => {

    const html = []
    
    html.push("<div class=\"card-body\">")

    for (let row of rows) {
        html.push("<div class=\"row\"><div class=\"col-md-12\">")
        html.push(`<strong>${context.decodeDate(row.creation_time.substring(0, 10))} ${row.creation_time.substr(11, 8)}:</strong>&nbsp; ${row.user_n_fn}`)
        html.push("</div></div>")
        html.push("<div class=\"row\"><div class=\"col-md-2\" align=\"right\">&nbsp;</div>")
        html.push(`<div class="col-md-10"><em>${row.text}</em></div></div>`)
    }
    html.push("</div>")

    return html.join("\n")
}

module.exports = {
    renderHistory
}