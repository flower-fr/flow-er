const fs = require("fs")
const extractText = require("../server/controller/importDoc")

// Exemple d'utilisation
const run = async () => {
    const files = [
        "./devis.pdf",
        "./proposition.docx"
    ]

    for (const file of files) {
        try {
            const text = await extractText(file)
            console.log(`--- Texte extrait de ${file} ---`)
            console.log(text) // Affiche les 500 premiers caractères
            // Sauvegardez le texte dans un fichier pour le ML
            // fs.writeFileSync(`./text_${file.replace(/\.[^/.]+$/, "")}.txt`, text)
        } catch (err) {
            console.error(`Erreur avec ${file}:`, err.message)
        }
    }
}
run()