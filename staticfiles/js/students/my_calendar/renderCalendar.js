import { student_datums_data } from '/static/js/students/my_calendar/temp_data.js';
import { showScheduleInOffcanvas } from '/static/js/students/my_calendar/showScheduleInOffcanvas.js';

const calendarEl = document.getElementById("calendar");
const monthYearEl = document.getElementById("monthYear");

export function renderCalendar(date) {
	calendarEl.innerHTML = "";
	const year = date.getFullYear();
	const month = date.getMonth();

	monthYearEl.textContent = date.toLocaleString("sl-SI", { month: "long", year: "numeric" });

	const firstDayOfMonth = new Date(year, month, 1);
	let startDay = firstDayOfMonth.getDay();
	if (startDay === 0) startDay = 7; // воскресенье

	let startDate = new Date(firstDayOfMonth);
	startDate.setDate(firstDayOfMonth.getDate() - (startDay - 1));

	for (let week = 0; week < 6; week++) {
		for (let day = 0; day < 5; day++) {
			const dayDate = new Date(startDate);
			dayDate.setDate(startDate.getDate() + week * 7 + day);

			const dayEl = document.createElement("div");
			dayEl.classList.add("day");
			if (dayDate.getMonth() !== month) {
				dayEl.classList.add("other-month");
			}

			const dayEvents = student_datums_data.filter(ev => ev.date === formatDateLocalISO(dayDate));
			dayEvents.forEach(ev => {
				const badge = document.createElement("div");
				badge.classList.add("event-badge");
				if (ev.type_cap === "UST") badge.classList.add("event-UST");
				if (ev.type_cap === "PIS") badge.classList.add("event-PIS");
				badge.textContent = ev.subject_cap;
				dayEl.appendChild(badge);
			});

			const numberEl = document.createElement("div");
			numberEl.classList.add("date-number");
			numberEl.textContent = dayDate.getDate();

			dayEl.appendChild(numberEl);
			calendarEl.appendChild(dayEl);
		}
	}
}

export function attachDayClickHandlers(currentDate, showScheduleInOffcanvas) {
	const dayEls = calendarEl.querySelectorAll(".day");
	dayEls.forEach(dayEl => {
		dayEl.addEventListener("click", () => {
			const dayNumber = parseInt(dayEl.querySelector(".date-number").textContent, 10);
			const isOtherMonth = dayEl.classList.contains("other-month");

			let year = currentDate.getFullYear();
			let month = currentDate.getMonth();

			if (isOtherMonth) {
				if (dayNumber > 20) {
					month -= 1;
					if (month < 0) {
						month = 11;
						year -= 1;
					}
				} else {
					month += 1;
					if (month > 11) {
						month = 0;
						year += 1;
					}
				}
			}

			const clickedDate = new Date(year, month, dayNumber);

			showScheduleInOffcanvas(clickedDate);
		});
	});
}

export function formatDateLocalISO(date) {
	const year = date.getFullYear();
	const month = (date.getMonth() + 1).toString().padStart(2, '0');
	const day = date.getDate().toString().padStart(2, '0');
	return `${year}-${month}-${day}`;
}
