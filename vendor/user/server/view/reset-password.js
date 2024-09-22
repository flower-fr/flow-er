
const renderResetPassword = (context, data) => {
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
        Pour réinitialiser votre mot de passe Flow-ER, veuillez cliquer sur le lien ci-dessous. Le lien va vous diriger sur l'espace client Flow-ER où vous pourrez saisir et confirmer votre nouveau mot de passe. 
        <br><br>
        <div class="activate"><a href="${data.resetPasswordLink}">Réinitialiser mon mot de passe</a></div>
        <br><br>
        Si le lien ne fonctionne pas, veuillez copier-coller  l’adresse suivante dans votre navigateur :<br>
        ${data.resetPasswordLink}
        <br><br>
        Ce lien n'est valide qu'<b>une heure</b>. En cas d'expiration de ce délai, vous devrez renouveler votre demande sur notre site <a href="${data.registrationLink}">${data.registrationLink}</a>
        <br><br>
        Si vous n'êtes pas à l'origine de cette demande de réinitialisation de mot de passe, merci d'ignorer cet email.
        <br><br>
        A très bientôt,<br>
        <b>Flow-ER</b>
    </div>
    </body>
</html>`
}

module.exports = {
    renderResetPassword
}
