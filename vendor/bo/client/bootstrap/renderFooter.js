const renderFooter = ({ context }, data) => {

    const footer = data.footer

    return `
    <!--Footer-->
    <footer class="container-fluid bg-body-tertiary">
        <div>
            <div class="row">
                <!--Copyright-->
                <div class="py-3 my-3 text-center container-fluid">
                    ${renderLinks({ context }, footer)}              
                </div>
        
            </div>
        </div>
    </footer>`
}

const renderLinks = ({ context }, footer) => {

    const links = []
    for (let link of footer) {
        links.push(context.localize(link.html))
    }
    return links.join("&nbsp;&nbsp;|&nbsp;&nbsp;")
}
