
const fullcalendarCallback = ({ context, entity, view }, data) => {

    const events = []
    for (let event of data.rows) {
        events.push({ 
            title: event.caption,
            start: `${event.date}T${event.start_time}`,
            end: `${event.date}T${event.end_time}`
        })
    }

    const calendarEl = document.getElementById("calendar")
    if (calendarEl) {
        const calendar = new FullCalendar.Calendar(calendarEl, {
            locale: context.user.locale.substring(0,2),
            buttonText: {
                today: context.translate("Today"),
                month: context.translate("Month"),
                week: context.translate("Week"),
                day: context.translate("Day"),
            },
            allDayText: context.translate("Day"),

            initialView: 'timeGridWeek',
            initialDate: "2024-08-05",
            nowIndicator: true,
            firstDay: 1,
            weekends: false,
            slotMinTime: "08:00:00",
            slotMaxTime: "18:00:00",
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
            },
            events: events
        })
    
        calendar.render()
    }
}
