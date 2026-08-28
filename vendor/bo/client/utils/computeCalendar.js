export default function computeCalendar(date, frame, specifier, weekDays)
{
    // Select year template to use
    let dateYear = parseInt(date.substr(0, 4)), dateMonth = parseInt(date.substr(5, 7)), dateYearEnd
    let defaultTemplate, template
    for (const [yearMonth, yearTemplate] of Object.entries(specifier)) {
        if (yearMonth === "*") defaultTemplate = yearTemplate
        else {
            const year = parseInt(yearMonth.substr(0, 4)), month = parseInt(yearMonth.substr(5, 7))
            if (dateMonth < month) {
                dateYearEnd = dateYear
                dateYear--
            }
            else {
                dateYearEnd = dateYear + 1
            }
            if (dateYear === year) template = yearTemplate
        }
    }
    if (template) {
        defaultTemplate.start = template.start
        defaultTemplate.end = template.end
        defaultTemplate.offDays = [...new Set([...defaultTemplate.offDays, ...template.offDays])]
    }

    // Push any day of scope matching the weekDays if given. Excluding the template's offDays
    let startDate, endDate
    if (frame === "week") {
        startDate = moment(date, "YYYY-MM-DD").startOf("week").format("YYYY-MM-DD")
        endDate = moment(date, "YYYY-MM-DD").endOf("week").format("YYYY-MM-DD")
    } else if (frame === "month") {
        startDate = moment(date, "YYYY-MM-DD").startOf("month").format("YYYY-MM-DD")
        endDate = moment(date, "YYYY-MM-DD").endOf("month").format("YYYY-MM-DD")
    } else if (frame === "year") {
        startDate = `${ dateYear.toString() }-${ defaultTemplate.start }`
        endDate = `${ dateYearEnd.toString() }-${ defaultTemplate.end }`
    }
    else {
        startDate = endDate = date
    }
    startDate = new Date(startDate)
    endDate = new Date(endDate)

    const result = []
    for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
        const weekDay = d.getDay(), formatted = moment(d).format("YYYY-MM-DD")
        if (defaultTemplate.openWeekDays.includes(weekDay)) {
            if (weekDays.length === 0 || weekDays.includes(weekDay)) {
                if (!defaultTemplate.offDays.includes(formatted.substr(5, 10))) {
                    result.push(formatted)
                }
                else {
                    console.log(formatted)
                }
            }
        }
    }
    return result
}
