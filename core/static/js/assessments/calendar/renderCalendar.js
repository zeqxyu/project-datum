import { student_datums_data, assessment_data } from '/static/js/assessments/calendar/temp_data.js';
import { savedRatings } from '/static/js/assessments/calendar/ratings.js';
import { showScheduleInOffcanvas } from '/static/js/assessments/calendar/showScheduleInOffcanvas.js';



const calendarEl = document.getElementById("calendar");
const monthYearEl = document.getElementById("monthYear");

export function markDay(dateISO, value) {
	// 1: +
	// -1: -
	// 0: просто оценивание

	const cell = document.getElementById(`cell-${dateISO}`); // клетка по айди
	if (!cell) return; // если день вне месяца

	// Сначала очищаем старое
	cell.querySelectorAll(".rating-badge").forEach(el => el.remove());
	cell.classList.remove("day-plus", "day-minus", "day-assessment");

	// Создаем бейдж
	let badge = null;
	if (value === 1) {
		badge = document.createElement("div");
		badge.classList.add("rating-badge", "rating-plus");
		badge.innerHTML = `<i class="bi bi-plus-circle"></i>`;
		cell.classList.add("day-plus");
		cell.style.boxShadow = "inset 0 0 3px 2px #00ff66"; // салатовый
	} else if (value === -1) {
		badge = document.createElement("div");
		badge.classList.add("rating-badge", "rating-minus");
		badge.innerHTML = `<i class="bi bi-dash-circle"></i>`;
		cell.classList.add("day-minus");
		cell.style.boxShadow = "inset 0 0 3px 2px #ff3333"; // красный
	} else if (value === 0) {
		cell.classList.add("day-assessment");
		cell.style.boxShadow = "inset 0 0 3px 1px #ffffff"; // белый
	}

	if (badge) cell.appendChild(badge);
}

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
	// то есть генерация самих клеток календаря
	for (let week = 0; week < 6; week++) {
		// для каждого дня
		for (let day = 0; day < 5; day++) {
			const dayDate = new Date(startDate);
			dayDate.setDate(startDate.getDate() + week * 7 + day);
			const isoDate = formatDateLocalISO(dayDate);

			// .other-month для подсветки серым
			const dayEl = document.createElement("div");
			dayEl.classList.add("day");
			if (dayDate.getMonth() !== month) {
				dayEl.classList.add("other-month");
			}

			// myDatums
			const dayEvents = student_datums_data.filter(ev => ev.date === formatDateLocalISO(dayDate));
			dayEvents.forEach(ev => {
				// если этот датум относится к текущему assessment — НЕ показываем "мой" бейдж здесь
				const isFromCurrentAssessment = assessmentDatumCodes.has(ev.code);
				if (isFromCurrentAssessment) {console.log("Пропущен бейдж:", ev); return;}

				const badge = document.createElement("div");
				badge.classList.add("event-badge");
				if (ev.type_cap === "UST") badge.classList.add("event-UST");
				if (ev.type_cap === "PIS") badge.classList.add("event-PIS");
				badge.textContent = ev.subject_cap;
				dayEl.appendChild(badge);
			});

			// бейджи assessment
			if (assessment_data.assessment_view) {
				const assessmentDayEvents = assessment_data.datums.filter(ev => ev.date === formatDateLocalISO(dayDate));
				if (assessmentDayEvents.length > 0) {
					// Подсчет
					const total = assessmentDayEvents.length;
					const owned = assessmentDayEvents.filter(ev => ev.student != null).length; // или свойство, что датум занят

					// Создание бейджа
					const badge = document.createElement("div");
					badge.classList.add("event-badge");

					if (assessment_data.type_cap === "UST") {
						if (assessmentDayEvents.some(ev => ev.student === menu_data.student_data.username)) {
							badge.classList.add("event-MY");
						} else if (owned === total) {
							badge.classList.add("event-OWN");
						} else {
							badge.classList.add("event-FRE");
						}
						badge.textContent = `${assessment_data.subject_cap} - ${owned}/${total}`;
					} else if (assessment_data.type_cap === "PIS") {
						badge.classList.add("event-PIS");
						badge.textContent = `${assessment_data.subject_cap}`;
					}

					
					dayEl.appendChild(badge);

					
					
				}
			}

			// добавляет номер дня
			const numberEl = document.createElement("div");
			numberEl.classList.add("date-number");
			numberEl.textContent = dayDate.getDate();
			
			dayEl.id = `cell-${isoDate}`;
			dayEl.appendChild(numberEl);
			calendarEl.appendChild(dayEl);

			// === 1) Проверка на существование датума (оценивание) ===
			const hasDatum = assessment_data.datums?.some(d => d.date === isoDate);
			if (hasDatum) {
				markDay(isoDate, 0); // ставим "просто день с оцениванием"
			}

			// === 2) Проверка на плюс/минус в savedRatings ===
			const rating = savedRatings?.date_ratings?.find(r => r.date === isoDate);
			if (rating) {
				if (rating.value === 1) {
					markDay(isoDate, 1); // плюс
				} else if (rating.value === -1) {
					markDay(isoDate, -1); // минус
				}
			}
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
