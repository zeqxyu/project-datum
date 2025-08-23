import { renderCalendar, attachDayClickHandlers } from '/static/js/students/my_calendar/renderCalendar.js';
import { showScheduleInOffcanvas } from '/static/js/students/my_calendar/showScheduleInOffcanvas.js';
import { showDatumDetails } from '/static/js/students/my_calendar/showDatumDetails.js';

let currentDate = new Date();

function init() {
    renderCalendar(currentDate);
    attachDayClickHandlers(currentDate, showScheduleInOffcanvas);

    document.getElementById("prevMonth").addEventListener("click", () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar(currentDate);
        attachDayClickHandlers(currentDate, showScheduleInOffcanvas);
    });
    document.getElementById("nextMonth").addEventListener("click", () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar(currentDate);
        attachDayClickHandlers(currentDate, showScheduleInOffcanvas);
    });
}

window.addEventListener('DOMContentLoaded', init);