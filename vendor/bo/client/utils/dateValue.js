export default function dateValue(value) {
    let result = value

    if (value.substr(0, 5) === "week-") {
        const shift = parseInt(value.substr(5))
        const startOfWeek = moment().subtract(shift, "weeks").startOf("week").format("YYYY-MM-DD")
        const endOfWeek = moment().subtract(shift, "weeks").endOf("week").format("YYYY-MM-DD")
        result = `between,${ startOfWeek },${ endOfWeek }`
    } else if (value.substr(0, 6) === "month-") {
        const shift = parseInt(value.substr(6))
        const startOfMonth = moment().subtract(shift, "months").startOf("month").format("YYYY-MM-DD")
        const endOfMonth = moment().subtract(shift, "months").endOf("month").format("YYYY-MM-DD")
        result = `between,${ startOfMonth },${ endOfMonth }`
    } else if (value.substr(0, 5) === "year-") {
        const shift = parseInt(value.substr(5))
        const startOfYear = moment().subtract(shift, "years").startOf("year").format("YYYY-MM-DD")
        const endOfYear = moment().subtract(shift, "years").endOf("year").format("YYYY-MM-DD")
        result = `between,${ startOfYear },${ endOfYear }`
    }

    else if (value === "week") {
        const startOfWeek = moment().startOf("week").format("YYYY-MM-DD")
        const endOfWeek = moment().endOf("week").format("YYYY-MM-DD")
        result = `between,${ startOfWeek },${ endOfWeek }`
    } else if (value === "month") {
        const startOfMonth = moment().startOf("month").format("YYYY-MM-DD")
        const endOfMonth = moment().endOf("month").format("YYYY-MM-DD")
        result = `between,${ startOfMonth },${ endOfMonth }`
    } else if (value === "year") {
        const startOfYear = moment().startOf("year").format("YYYY-MM-DD")
        const endOfYear = moment().endOf("year").format("YYYY-MM-DD")
        result = `between,${ startOfYear },${ endOfYear }`
    }

    return result
}
