const renderSearchInput = ({ context }, indexConfig) => 
{
    let filters = []

    filters.push(`
        <section class="w-20 text-center pb-4">
            <div class="input-group mb-3">
                <button class="btn btn-outline-primary fl-search-refresh" type="button" data-mdb-ripple-init data-mdb-ripple-color="dark">
                    <i class="fas fa-search"></i>
                </button>
                <input
                    type="search"
                    class="form-control rounded fl-search-item fl-search-input"
                    placeholder="${ (indexConfig.keywords && indexConfig.keywords.placeholder) ? context.localize(indexConfig.keywords.placeholder) : context.translate("Search") }"
                    data-property-id="keywords"
                    id="flSearch-keywords"
                    aria-label="Search"
                    aria-describedby="search-addon"
                />
            </div>
        </section>`)
    
    return filters.join("\n")
}

module.exports = {
    renderSearchInput
}
