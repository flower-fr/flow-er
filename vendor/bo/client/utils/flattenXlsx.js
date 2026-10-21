function separateMultipleLastFirst(input) {
    // L'expression régulière cherche une séquence :
    // - Nom(s) en majuscules (éventuellement composés avec des espaces ou tirets)
    // - Suivi d'un prénom (1ère lettre majuscule, suite minuscules, composé ou non)
    const regex = /((?:[A-ZÀ-Ÿ0-9]+(?:[\s-][A-ZÀ-Ÿ0-9]+)*))\s+([A-ZÀ-Ÿ][a-zà-ÿ]+(?:[\s-][A-ZÀ-Ÿ][a-zà-ÿ]+)*)/g

    const result = []
    let match

    while ((match = regex.exec(input)) !== null) {
        result.push({
            lastname: match[1].trim(),
            firstname: match[2].trim(),
            formattedname: match[0].trim()
        })
    }
    return result
}

const flattenXlsx = (xlsxRows, config) => {
    let rows = []
    for (const xlsxRow of xlsxRows) {
        const flattenerHeader = config.params.flattening.header
        const loadedVector = xlsxRow[flattenerHeader]
        if (config.params.flattening.format === "LASTNAME Firstname") {
            const names = separateMultipleLastFirst(loadedVector)
            rows = rows.concat(names.map(name => {
                const row = {}
                for (const value of Object.values(config.properties)) {
                    if (value.header === "lastname") {
                        row[value.property] = name.lastname
                    }
                    else if (value.header === "firstname") {
                        row[value.property] = name.firstname
                    }
                    else if (value.header === "formattedname") {
                        row[value.property] = name.formattedname
                    }
                    else {
                        row[value.property] = xlsxRow[value.header]                        
                    }
                }
                return row
            }))
        }
    }
console.log(rows)
    return rows
}

export default flattenXlsx