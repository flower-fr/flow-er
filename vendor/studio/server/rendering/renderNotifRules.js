const { renderHead } = require("./renderHead")
const { renderHeader } = require("./renderHeader")
const { renderFooter } = require("./renderFooter")
const { renderScripts } = require("./renderScripts")

const renderNotifRules = ({ context, entity, view }, data) => {

    return `<!DOCTYPE html>
    <html lang="fr" data-mdb-theme="dark">
    
        ${ renderHead() }
        
        <body>
            <div>
                <!-- Header -->
                <div id="headerDiv">
                    ${renderHeader({ context, entity, view }, data)}
                </div>

                <div class="m-3">
                    <div class="section" id="dataview"></div>
                </div>
            
                <!-- Footer -->
                ${renderFooter({ context, entity, view }, data)}
            </div>
        </body>

        ${ renderScripts() }

        <script src="/mdb/cli/controller/mdbUpdateCallback.js"></script>

        <script type="module" src="/studio/cli/outbound/loadPage.js" data-json="${ encodeURI(JSON.stringify({ "entity": entity })) }" id="module-script"></script>

    </html>`
}

module.exports = {
    renderNotifRules
}
