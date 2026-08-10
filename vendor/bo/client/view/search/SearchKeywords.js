import View from "../View.js"
export default class SearchKeywords extends View
{
    constructor({ controller, placeholder, layout })
    {
        super({ controller })
        this.placeholder = placeholder
        this.layout = layout
    }

    render = (placeholder) =>
    {
        if (!placeholder) placeholder = this.placeholder
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
                        placeholder="${ placeholder }"
                        aria-label="Search"
                    />
                </div>
            </section>`)

        return html.join("\n")
    }

    trigger = async () =>
    {
        const {layout} = this

        const keywords = document.getElementById("flSearchKeywords")
        const keywordsRefresh = document.getElementById("flSearchKeywordsRefresh")

        // Quick keyword search

        new mdb.Ripple(keywordsRefresh, { rippleColor: "primary" })
        keywords.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault()
                layout.refreshList({ where:`keywords:contains,${ keywords.value }`, tags: this.extractTags() })
                keywordsRefresh.classList.remove("btn-primary")
                keywordsRefresh.classList.add("btn-outline-primary")
            } else {
                keywordsRefresh.classList.remove("btn-outline-primary")
                keywordsRefresh.classList.add("btn-primary")
            }
        })
        keywords.addEventListener("focusout", () => {
            if (keywords.value === "") {
                keywordsRefresh.classList.remove("btn-primary")
                keywordsRefresh.classList.add("btn-outline-primary")
            } else {
                keywordsRefresh.classList.remove("btn-outline-primary")
                keywordsRefresh.classList.add("btn-primary")
            }
        })
        keywordsRefresh.addEventListener("click", () => {
            layout.refreshList({ where:`keywords:contains,${ keywords.value }` })
            keywordsRefresh.classList.remove("btn-primary")
            keywordsRefresh.classList.add("btn-outline-primary")
        })
    }
}
