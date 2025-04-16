const [entity] = Object.values(JSON.parse(decodeURI(document.getElementById("module-script").dataset.json)))

const indexView = ({ context, entity }) => {

    const html = []

    html.push(
        `<div class="container">
            <input type="hidden" id="formJwt" name="formJwt" value="" />`
    )

    html.push(`
            <form class="row g-4" id="flJsonForm">
                <div class="row">
                    <div class="row" id="flList"></div>`)

    html.push(`
                <div class="form-group row fl-json-submit-div">
                    <div class="col">
                        <input type="submit" class="btn btn-warning fl-json-submit fl-json-add" value="${ context.translate("Add") }">
                        <input type="submit" class="btn btn-warning fl-json-submit fl-json-update" value="${ context.translate("Update") }">
                        <button type="button" class="btn btn-outline-primary fl-json-submit fl-json-delete" title="${ context.translate("Delete") }"><i class="fas fa-trash-alt"></i></button>
                    </div>
                </div>
                <div class="form-group row my-3 fl-json-message-div">
                    <h5 class="alert alert-success text-center fl-json-message">${context.translate("Your request has been registered")}</h5>
                </div>
                </div>
            </form>
        </div>`)

    return html.join("\n")
}

export { indexView }