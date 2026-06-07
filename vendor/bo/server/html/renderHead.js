
const renderHead = ({ title }) =>
{
    return `<!-- Head -->
    <head><title>${ title }</title>
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
        <!-- MDB ESSENTIAL -->
        <link rel="stylesheet" href="/mdb/cli/resources/mdb/css/mdb.min.css" />
        <!-- MDB PLUGINS -->
        <link rel="stylesheet" href="/mdb/cli/resources/mdb/plugins/css/all.min.css" />
        <style>
            .screen {
                transition: opacity 0.3s ease, transform 0.3s ease;
                position: absolute;
                width: 100%;
                padding: 20px;
            }

            .screen.hidden {
            opacity: 0;
                transform: translateX(20px);
                pointer-events: none;
            }

            .screen.visible {
                opacity: 1;
                transform: translateX(0);
            }

            /* Style pour le bouton Retour */
            .back-button {
                border: none;
                cursor: pointer;
                padding: 0;
                margin-bottom: 20px;
            }
        </style>
   </head>`
}

module.exports = {
    renderHead
}
