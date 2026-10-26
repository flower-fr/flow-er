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

function getDatesByWeekDays(startDateStr, endDateStr, weekDays) {
    const dates = []
    const [dayS, monthS, yearS] = startDateStr.split("/")
    startDateStr = `${yearS}-${monthS}-${dayS}`
    const [dayE, monthE, yearE] = endDateStr.split("/")
    endDateStr = `${yearE}-${monthE}-${dayE}`
    const current = new Date(startDateStr)
    const end = new Date(endDateStr)

    // Boucle du jour de début au jour de fin inclus
    while (current <= end) {
        // current.getDay() retourne 0 pour dimanche, 1 pour lundi, etc.
        if (weekDays.includes(current.getDay())) {
            // Formate la date en YYYY-MM-DD sans décalage de fuseau horaire
            const year = current.getFullYear()
            const month = String(current.getMonth() + 1).padStart(2, "0")
            const day = String(current.getDate()).padStart(2, "0")
            
            dates.push(`${year}-${month}-${day}`)
        }
        // Passage au jour suivant
        current.setDate(current.getDate() + 1)
    }
    return dates
}

const flattenXlsx = (xlsxRows, config) => {
    let rows = []
    for (const xlsxRow of xlsxRows) {
        if (config.params.flattening.header) {
            const flattenerHeader = config.params.flattening.header
            const loadedVector = xlsxRow[flattenerHeader]
            if (config.params.flattening.format === "LASTNAME Firstname") {
                const names = separateMultipleLastFirst(loadedVector)
                rows = rows.concat(names.map(name => {
                    const row = {}
                    row.flatIdentifier = []
                    for (const value of Object.values(config.properties)) {
                        if (value.flattenHeader === "lastname") {
                            row[value.property] = name.lastname
                        }
                        else if (value.flattenHeader === "firstname") {
                            row[value.property] = name.firstname
                        }
                        else if (value.flattenHeader === "formattedname") {
                            row[value.property] = name.formattedname
                        }
                        else {
                            row[value.property] = xlsxRow[value.flattenHeader]                        
                        }
                        row.flatIdentifier.push(row[value.property])
                    }
                    row.flatIdentifier = row.flatIdentifier.join("|")
                    return row
                }))
            }
        }
        else if (config.params.flattening.period) {
            const startDate = config.params.flattening.period.startDate
            const endDate = config.params.flattening.period.endDate
            const weekDayProp = config.params.flattening.period.weekDay
            const weekDay = (config.params.flattening.period.weekDayFormat) ? config.params.flattening.period.weekDayFormat.modalities[xlsxRow[weekDayProp]] : xlsxRow[weekDayProp]
            const dates = getDatesByWeekDays(xlsxRow[startDate], xlsxRow[endDate], [weekDay])
            rows = rows.concat(dates.map(date => {
                const row = {}
                row.flatIdentifier = []
                for (const value of Object.values(config.properties)) {
                    if (value.flattenHeader === "date") {
                        row[value.property] = date
                    }
                    else {
                        row[value.property] = xlsxRow[value.flattenHeader]                        
                    }
                    row.flatIdentifier.push(row[value.property])
                }
                row.flatIdentifier = row.flatIdentifier.join("|")
                return row
            }))
        }
    }
    return rows
}

export default flattenXlsx