
const renderHead = ({ context, entity, view }, { tab }) => {

    return `<!-- Head -->
    <head><title>${ (tab) ? context.localize(tab.labels) : "Flow-ER" }</title>
        <meta charset="utf-8">
        <meta name="robots" content="noindex, nofollow">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <meta http-equiv="x-ua-compatible" content="ie=edge">
        <link href="/bo/cli/resources/bootstrap-5.3.3-dist/css/bootstrap.min.css" rel="stylesheet">
        <link rel="stylesheet" href="/bo/cli/resources/jquery-ui-1.13.2/jquery-ui.css">
        <link rel="stylesheet" href="/bo/cli/resources/jquery.timepicker/jquery.timepicker.css">
        <link rel="stylesheet" href="/bo/cli/resources/toastr/build/toastr.min.css" rel="stylesheet" />
        <link rel='stylesheet' href="/bo/cli/resources/json-viewer/jquery.json-viewer.css" />
        <link rel='stylesheet' href="/bo/cli/resources/fullcalendar/fullcalendar.css" />
        <link rel='stylesheet' href="/bo/cli/resources/fontawesome/css/fontawesome.css" />
        <link rel='stylesheet' href="/bo/cli/resources/fontawesome/css/brands.css" />
        <link rel='stylesheet' href="/bo/cli/resources/fontawesome/css/solid.css" />
          
        <style>
        .chip {
            display: inline-block;
            padding: 0 10px;
            height: 25px;
            font-size: 11px;
            line-height: 25px;
            border-radius: 25px;
        }

        .material-symbols-outlined {
            font-variation-settings:
            'FILL' 0,
            'wght' 400,
            'GRAD' 0,
            'opsz' 24
        }

        /* Recommended icon sizes */
        span.size-20 {
            font-size: 20px;
            font-variation-settings: 'OPSZ' 20;
        }
        span.size-24 {
            font-size: 24px;
            font-variation-settings: 'OPSZ' 24;
        }
        span.size-40 {
            font-size: 40px;
            font-variation-settings: 'OPSZ' 40;
        }
        span.size-48 {
            font-size: 48px;
            font-variation-settings: 'OPSZ' 48;
        }

        /* Rules for using icons as black on a light background. */
        .dark {
            background: black;
            color: rgba(255, 255, 255, 1);
            font-variation-settings: 'GRAD' -25;
        }
        .dark-inactive {
            background: black;
            color: rgba(255, 255, 255, 0.3);
            font-variation-settings: 'GRAD' -25;
        }
        </style>
    </head>`
}

module.exports = {
    renderHead
}
