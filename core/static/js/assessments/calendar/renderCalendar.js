import { student_datums_data, assessment_data } from '/static/js/assessments/calendar/temp_data.js';
import { showScheduleInOffcanvas } from '/static/js/assessments/calendar/showScheduleInOffcanvas.js';



const calendarEl = document.getElementById("calendar");
const monthYearEl = document.getElementById("monthYear");

export function renderCalendar(date, menu_data) {
	calendarEl.innerHTML = "";
	const year = date.getFullYear();
	const month = date.getMonth();

	
	// заголовок месяца
	monthYearEl.textContent = date.toLocaleString("sl-SI", { month: "long", year: "numeric" });

	// что-бы неделя начиналась с понедельника
	const firstDayOfMonth = new Date(year, month, 1);
	let startDay = firstDayOfMonth.getDay();
	if (startDay === 0) startDay = 7; // воскресенье

	// дата понедельника прошлой недели
	let startDate = new Date(firstDayOfMonth);
	startDate.setDate(firstDayOfMonth.getDate() - (startDay - 1));

	// собрать коды всех датумов текущего оценивания (если мы в assessment_view)
	const assessmentDatumCodes = (assessment_data && assessment_data.assessment_view && Array.isArray(assessment_data.datums))
	? new Set(assessment_data.datums.map(d => d.code))
	: new Set();

	// 6 недель по 5 рабочих дней в каждой (то есть только понедельник–пятница, без выходных)
	for (let week = 0; week < 6; week++) {
		for (let day = 0; day < 5; day++) {
			const dayDate = new Date(startDate);
			dayDate.setDate(startDate.getDate() + week * 7 + day);

			// .other-month для подсветки серым
			const dayEl = document.createElement("div");
			dayEl.classList.add("day");
			if (dayDate.getMonth() !== month) {
				dayEl.classList.add("other-month");
			}

			
			// // добавляет бейджики My_calendar
			// const dayEvents = student_datums_data.filter(ev => ev.date === formatDateLocalISO(dayDate));
			// dayEvents.forEach(ev => {
			// 	const badge = document.createElement("div");
			// 	badge.classList.add("event-badge");
			// 	if (ev.type_cap === "UST") badge.classList.add("event-UST");
			// 	if (ev.type_cap === "PIS") badge.classList.add("event-PIS");
			// 	badge.textContent = ev.subject_cap;
			// 	dayEl.appendChild(badge);
			// });

			const dayEvents = student_datums_data.filter(ev => ev.date === formatDateLocalISO(dayDate));
			dayEvents.forEach(ev => {
				// если этот датум относится к текущему оцениванию — НЕ показываем "мой" бейдж здесь
				const isFromCurrentAssessment = assessmentDatumCodes.has(ev.code);
				if (isFromCurrentAssessment) {console.log("Пропущен бейдж:", ev); return;}

				const badge = document.createElement("div");
				badge.classList.add("event-badge");
				if (ev.type_cap === "UST") badge.classList.add("event-UST");
				if (ev.type_cap === "PIS") badge.classList.add("event-PIS");
				badge.textContent = ev.subject_cap;
				dayEl.appendChild(badge);
			});

			// бейджи устных оцениваний
			if (assessment_data.assessment_view && assessment_data.type_cap === "UST") {
				const assessmentDayEvents = assessment_data.datums.filter(ev => ev.date === formatDateLocalISO(dayDate));
				if (assessmentDayEvents.length > 0) {
					// Подсчет
					const total = assessmentDayEvents.length;
					const owned = assessmentDayEvents.filter(ev => ev.student != null).length; // или свойство, что датум занят

					// Создание бейджа
					const badge = document.createElement("div");
					badge.classList.add("event-badge");

					if (assessmentDayEvents.some(ev => ev.student === menu_data.student_data.username)) {
						badge.classList.add("event-MY");
					} else if (owned === total) {
						badge.classList.add("event-OWN");
					} else {
						badge.classList.add("event-FRE");
					}

					badge.textContent = `${assessment_data.subject_cap} - ${owned}/${total}`;
					dayEl.appendChild(badge);

					// Подсветка дня
					dayEl.classList.add("has-assessment");
				}
			}

			// добавляет номер дня
			const numberEl = document.createElement("div");
			numberEl.classList.add("date-number");
			numberEl.textContent = dayDate.getDate();

			dayEl.appendChild(numberEl);
			calendarEl.appendChild(dayEl);
		}
	}
}

// обрабатывает клик на день
// Передаёт дату в showScheduleInOffcanvas(clickedDate)
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

			const clickedDateISO = formatDateLocalISO(clickedDate);

			let dayEvents = student_datums_data.filter(ev => ev.date === clickedDateISO);

			if (assessment_data.assessment_view) {
				const assessmentDayEvents = assessment_data.datums.filter(ev => ev.date === clickedDateISO);
				dayEvents = [...dayEvents, ...assessmentDayEvents];
			}

			showScheduleInOffcanvas(clickedDate, dayEvents);
		});
	});
}


// Преобразует Date в YYYY-MM-DD (локальный формат без смещения часового пояса).
export function formatDateLocalISO(date) {
	const year = date.getFullYear();
	const month = (date.getMonth() + 1).toString().padStart(2, '0');
	const day = date.getDate().toString().padStart(2, '0');
	return `${year}-${month}-${day}`;
}
