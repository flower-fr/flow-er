const renderHead = (recaptchaToken) => {
    return `
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <meta http-equiv="x-ua-compatible" content="ie=edge" />
        <title>Flow-ER</title>
        <!-- Font Awesome -->
        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.11.2/css/all.css" />
        <!-- Google Fonts Roboto -->
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" />
        <!-- MDB ESSENTIAL -->
        <link rel="stylesheet" href="/mdb/cli/resources/mdb/css/mdb.min.css" />
        <!-- MDB PLUGINS -->
        <link rel="stylesheet" href="/mdb/cli/resources/mdb/plugins/css/all.min.css" />
        <!-- Custom styles -->
        <link rel="stylesheet" href="/css/style.css" />
        <link rel="stylesheet" href="/css/medium-editor.css"> <!-- Core -->
        <link rel="stylesheet" href="/css/themes/default.css"> <!-- or any other theme -->
        <script src="https://www.google.com/recaptcha/enterprise.js?render=${ recaptchaToken }"></script>

        <style>
        .mask-custom {
            backdrop-filter: blur(6px);
            background-color: rgba(0, 0, 0, .4);
        }
        </style>
    </head>`
}

module.exports = {
    renderHead
}