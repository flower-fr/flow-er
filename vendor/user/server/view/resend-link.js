
const renderResendLink = (context, data) => {
    return `<!doctype html>
<html lang="fr">
<head>
    <meta charset="UTF-8"/>
    <style>
        body {
            font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
            color: #353535;
            background-color: #FFFFFF;
            margin: 0;
        }
        .content {
            margin: 10px;
        }
        .header {
            background-color: #EFEFEF;
            width:100%;
            height: 54px;
        }
        .header img {
            width: 250px;
            margin-top: 10px;
            margin-left: 10px;
        }
        a {
            color: #9e084e;
            font-weight: bold;
            text-decoration: none;
        }
        .activate {
            text-align: center;
        }
    </style>
</head>
<body>
<div class="content">
    Bonjour,<br><br>
    Vous avez demandé un nouveau lien pour finaliser la création de votre compte Flow-ER. Veuillez la terminer en cliquant sur le lien ci-dessous :
    <br><br>
    <div class="activate"><a href="${data.activationLink}">Activer mon compte</a></div>
    <br><br>
    Si le lien ne fonctionne pas, veuillez copier-coller l’adresse suivante dans votre navigateur :<br>
    ${data.activationLink}
    <br><br>
    Ce lien n'est valide que <b>1 heure</b>. En cas d'expiration de ce délai, vous pourrez en demander un nouveau depuis la page du lien expiré.
    <br><br>
    Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet e-mail : aucune action ne sera effectuée sur votre compte.
    <br><br>
    A très bientôt,<br>
    <b>${data.instanceCaption}</b>
</div>
</body>
</html>`
}

module.exports = {
    renderResendLink
}
