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
    const [dayE, monthE, yearE] = endDateStr.split("/")
    const current = new Date(yearS, monthS - 1, dayS)
    const end = new Date(yearE, monthE - 1, dayE)

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

const JOURS = { dimanche: 0, lundi: 1, mardi: 2, mercredi: 3, jeudi: 4, vendredi: 5, samedi: 6 };

// "07/01/2027" -> Date locale à minuit (évite les décalages UTC vu précédemment)
function parseDateFr(s) {
    const [j, m, a] = s.trim().split("/").map(Number);
    return new Date(a, m - 1, j);
}
const isoLocal = d => d.getFullYear() + "-" +
    String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");

// numéro de semaine ISO 8601 (le jeudi est le jour pivot)
function semaineISO(d) {
    const date = new Date(d);
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7)); // jeudi de la semaine
    const premierJeudi = new Date(date.getFullYear(), 0, 4);
    premierJeudi.setDate(premierJeudi.getDate() + 3 - ((premierJeudi.getDay() + 6) % 7));
    return 1 + Math.round((date - premierJeudi) / (7 * 864e5));
}

// "[1..6,8..12]" -> Set([1,2,3,4,5,6,8,9,10,11,12])
function parseSemaines(pattern) {
    const set = new Set();
    pattern.replace(/[[\]]/g, "").split(",").forEach(part => {
        part = part.trim();
        if (!part) return;
        const m = part.split("..");
        if (m.length === 2) {
            for (let n = Number(m[0]); n <= Number(m[1]); n++) set.add(n);
        } else set.add(Number(m));
    });
    return set;
}

/**
 * Construit la liste des [date, [salles]] d'un cours récurrent.
 * Une même date peut associer plusieurs salles (toutes celles dont
 * le pattern de semaines contient le numéro de semaine de la date).
 * @returns {Array<[string, string[]]>} tuples [date "YYYY-MM-DD", [salles]]
 */
function planifierCours(dateDebut, dateFin, jour, semaines, salles, repartition) {
    const cible = jour && jour.trim() ? JOURS[jour.toLowerCase()] : 0
    if (cible === undefined) throw new Error("Jour inconnu : " + jour)

    const semainesCours = parseSemaines(semaines)

    // Salles optionnelles : null, undefined ou "" => aucune salle affectée
    const listeSalles = salles ? salles.trim().split(/\s{2,}/).filter(Boolean) : []
    const patterns = repartition ? repartition.trim().split(/\s{2,}/) : [];
    if (patterns.length !== listeSalles.length)
        throw new Error(patterns.length + " pattern(s) pour " + listeSalles.length + " salle(s)")
    const semainesParSalle = patterns.map(parseSemaines)

    const resultats = []
    let current = parseDateFr(dateDebut)
    const fin = parseDateFr(dateFin)
    current.setDate(current.getDate() + (cible - current.getDay() + 7) % 7)

    while (current.getTime() <= fin.getTime()) {
        const numSemaine = semaineISO(current)
        if (semainesCours.has(numSemaine)) {
            // TOUTES les salles dont le pattern contient la semaine
            const sallesDuJour = listeSalles.filter(
                (_, i) => semainesParSalle[i].has(numSemaine)
            )
            resultats.push([isoLocal(current), sallesDuJour])
        }
        current.setDate(current.getDate() + 7)
    }
    return resultats
}

const flattenXlsx = (xlsxRows, config) => {
    let rows = [], i = 0
    for (const xlsxRow of xlsxRows) {
        i++
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
        else if (config.params.flattening.periodByRoom) {
            const startDate = config.params.flattening.periodByRoom.startDate
            const endDate = config.params.flattening.periodByRoom.endDate
            const weekDay = config.params.flattening.periodByRoom.weekDay
            const weeks = config.params.flattening.periodByRoom.weeks
            const rooms = config.params.flattening.periodByRoom.rooms
            const distribution = config.params.flattening.periodByRoom.distribution
            const dates = planifierCours(xlsxRow[startDate], xlsxRow[endDate], xlsxRow[weekDay], xlsxRow[weeks], xlsxRow[rooms], xlsxRow[distribution])
            rows = rows.concat(dates.map(([date, rooms]) => {
                const row = {}
                row.flatIdentifier = []
                for (const value of Object.values(config.properties)) {
                    if (value.flattenHeader === "date") {
                        row[value.property] = date
                        row.rooms = rooms
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