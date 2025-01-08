const mdbRenderHead = ({ context, entity, view }, data) => {

    const tab = data.tab

    return `<!-- Head -->
    <head><title>${ (tab) ? context.localize(tab.labels) : "Flow-ER" }</title>
        <meta charset="UTF-8" />
        <meta name="robots" content="noindex, nofollow">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <meta http-equiv="x-ua-compatible" content="ie=edge" />
        <!-- MDB icon -->
        <!-- Font Awesome -->
        <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
        />
        <!-- Google Fonts Roboto -->
        <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700;900&display=swap"
        />
        <!-- Google Fonts Albert Sans -->
        <link 
        rel='stylesheet' 
        id='gdlr-core-google-font-css' 
        href='https://fonts.googleapis.com/css?family=Albert+Sans%3A100%2C200%2C300%2Cregular%2C500%2C600%2C700%2C800%2C900%2C100italic%2C200italic%2C300italic%2Citalic%2C500italic%2C600italic%2C700italic%2C800italic%2C900italic%7CAbril+Fatface%3Aregular&#038;subset=latin%2Clatin-ext&#038;ver=6.7.1' 
        type='text/css' media='all' 
        />
        <!-- MDB ESSENTIAL -->
        <link rel="stylesheet" href="/mdb/cli/resources/mdb/css/mdb.min.css" />
        <!-- MDB PLUGINS -->
        <link rel="stylesheet" href="/mdb/cli/resources/mdb/plugins/css/all.min.css" />
   </head>`
}

module.exports = {
    mdbRenderHead
}
