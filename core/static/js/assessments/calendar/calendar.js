import { renderCalendar, attachDayClickHandlers } from '/static/js/assessments/calendar/renderCalendar.js';
import { showScheduleInOffcanvas } from '/static/js/assessments/calendar/showScheduleInOffcanvas.js';
import { renderAssessmentCard } from '/static/js/assessments/calendar/assessmentInfo.js';

import {menu_data} from '/static/js/core/main_template/temp_data.js' // .student_data.username 
import {assessment_data} from '/static/js/assessments/calendar/temp_data.js' 

let currentDate = new Date();

function init() {
    // если assessment_view == true, то сдвигаем currentDate
    if (assessment_data.assessment_view === true) {
        let allDatums = assessment_data.datums || [];
        let myDatums = assessment_data.datums.filter(d => d.student === menu_data.student_data.username);

        let targetDatum = null;
        if (myDatums.length > 0) {
            targetDatum = myDatums[0]; // берем первый датум студента
        } else if (allDatums.length > 0) {
            targetDatum = allDatums[0]; // берем первый общий датум
        }

        if (targetDatum) {
            currentDate = new Date(targetDatum.date); // подставляем месяц датума
        }
    }

    renderAssessmentCard(assessment_data);

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