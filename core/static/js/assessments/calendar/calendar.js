import { renderCalendar, attachDayClickHandlers } from '/static/js/assessments/calendar/renderCalendar.js';
import { showScheduleInOffcanvas } from '/static/js/assessments/calendar/showScheduleInOffcanvas.js';

import {menu_data} from '/static/js/core/main_template/temp_data.js' // .student_data.username

let currentDate = new Date();

function init() {
    renderCalendar(currentDate, menu_data);
    attachDayClickHandlers(currentDate, showScheduleInOffcanvas);

    document.getElementById("prevMonth").addEventListener("click", () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar(currentDate, menu_data);
        attachDayClickHandlers(currentDate, showScheduleInOffcanvas);
    });
    document.getElementById("nextMonth").addEventListener("click", () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar(currentDate, menu_data);
        attachDayClickHandlers(currentDate, showScheduleInOffcanvas);
    });
}

window.addEventListener('DOMContentLoaded', init);