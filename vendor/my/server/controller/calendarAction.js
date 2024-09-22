const { assert } = require("../../../../core/api-utils")

const { renderCalendar } = require("../view/renderCalendar")

const calendarAction = async ({ req }, context, db) => {
    return renderCalendar()
}

module.exports = {
    calendarAction
}