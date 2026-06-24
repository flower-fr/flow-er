import View from "../View.js"
export default class SearchKeywords extends View
{
    constructor({ controller, placeholder })
    {
        super({ controller })
        this.placeholder = placeholder
    }

    render = () =>
    {
        const html = []

        html.push(`
            <section class="w-20 text-center">
                <div class="input-group mb-3">
                    <button class="btn btn-outline-primary" type="button" id="flSearchKeywordsRefresh" data-mdb-ripple-init data-mdb-ripple-color="dark">
                        <i class="fas fa-search"></i>
                    </button>
                    <input
                        type="search"
                        class="form-control rounded"
                        id="flSearchKeywords"
                        placeholder="${ this.placeholder }"
                        aria-label="Search"
                    />
                    &nbsp;&nbsp;&nbsp;&nbsp;
                </div>
            </section>`)

        return html.join("\n")
    }
}
