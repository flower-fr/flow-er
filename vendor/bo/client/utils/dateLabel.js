export default function dateLabel(label) {
    const monthLabels = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"]
    let result = label
    if (label.substr(0, 5) === "week-") {
        const shift = parseInt(label.substr(5))
        result = `S${ moment().subtract(shift, "weeks").week() }`
    } else if (label.substr(0, 6) === "month-") {
        const shift = parseInt(label.substr(6))
        result = monthLabels[parseInt(moment().subtract(shift, "months").format("MM")) - 1]
    } else if (label.substr(0, 5) === "year-") {
        const shift = parseInt(label.substr(5))
        result = moment().subtract(shift, "years").format("YYYY")
    } else if (label === "week") {
        result = `S${ moment().week() }`
    } else if (label === "month") {
        const shift = parseInt(label.substr(6))
        result = monthLabels[parseInt(moment().format("MM")) - 1]
    } else if (label === "year") {
        const shift = parseInt(label.substr(5))
        result = moment().format("YYYY")
    }
    return result
}
