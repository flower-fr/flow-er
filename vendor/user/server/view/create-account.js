
const renderCreateAccount = (context, data) => {
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
    Bonjour et merci pour votre inscription,<br><br>
    Nous avons bien reçu votre demande de création de votre compte Flow-ER. Veuillez finaliser la création en cliquant sur le lien ci-dessous :
    <br><br>
    <div class="activate"><a href="${data.activationLink}">Activer mon compte</a></div>
    <br><br>
    Si le lien ne fonctionne pas, veuillez copier-coller  l’adresse suivante dans votre navigateur :<br>
    ${data.activationLink}
    <br><br>
    Ce lien n'est valide que <b>48 heures</b>. En cas d'expiration de ce délai, vous devrez renouveler votre demande sur notre site <a href="${data.registrationLink}">${data.registrationLink}</a>
    <br><br>
    A très bientôt,<br>
    <b>${data.instanceCaption}</b>
</div>
</body>
</html>`
}

module.exports = {
    renderCreateAccount
}
