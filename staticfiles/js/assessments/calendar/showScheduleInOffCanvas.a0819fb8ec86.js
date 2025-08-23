import { student_datums_data, assessment_data, schedule_data } from '/static/js/assessments/calendar/temp_data.js';
import { showMyDatumDetails, showAssessmentDatumDetails } from '/static/js/assessments/calendar/showDatumDetails.js';
import { formatDateLocalISO } from '/static/js/assessments/calendar/renderCalendar.js';

import { menu_data } from '/static/js/core/main_template/temp_data.js'

// получение элементов ДОМ
const dayOffcanvasEl = document.getElementById("dayOffcanvas");
const dayTitleEl = document.getElementById("dayTitle");
const lessonListEl = document.getElementById("lessonList");
const offcanvas = new bootstrap.Offcanvas(dayOffcanvasEl);

// вспомогательные функции
function getWeekdayShortName(dayNum) {
	const days = ['NE', 'PO', 'TO', 'SR', 'ČE', 'PE', 'SO', 'NE'];
	return days[dayNum] || '';
}
// делает красивую дату 2025-03-02 -> 02.03.2025
function formatDateWithWeekday(date) {
	const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
	const dateStr = date.toLocaleDateString('sl-SI', options);
	const weekday = getWeekdayShortName(date.getDay());
	return `${dateStr} (${weekday})`;
}


export function showScheduleInOffcanvas(date) {
	const dayOfWeek = date.getDay();

	// проверка на выходные
	if (dayOfWeek < 1 || dayOfWeek > 5) {
		dayTitleEl.textContent = formatDateWithWeekday(date);
		lessonListEl.innerHTML = '<em>Ta dan ni šolski dan.</em>';
		offcanvas.show();
		return;
	}

	// Получение расписания на день недели
	const scheduleForDay = schedule_data.schedule[dayOfWeek];
	dayTitleEl.textContent = formatDateWithWeekday(date);

	if (!scheduleForDay) {
		lessonListEl.innerHTML = '<em>Ni razporeda za ta dan.</em>';
		offcanvas.show();
		return;
	}

	// создает таблицу в хтмл
	const dateISO = formatDateLocalISO(date);

	const table = document.createElement('table');
	table.className = 'table table-dark table-striped mb-0 fs-5';

	const thead = document.createElement('thead');
	thead.innerHTML = `
		<tr>
			<th scope="col" style="width: 60px;">Ura:</th>
			<th scope="col">Predmet:</th>
		</tr>`;
	table.appendChild(thead);

	const tbody = document.createElement('tbody');

	// перебор уроков и создание строк
	for (let lessonNum = 0; lessonNum < scheduleForDay.length; lessonNum++) {
		const tr = document.createElement('tr');

		const tdNum = document.createElement('th');
		tdNum.scope = 'row';
		tdNum.textContent = lessonNum;
		tr.appendChild(tdNum);

		const tdSubject = document.createElement('td');
		const subjectCode = scheduleForDay[lessonNum];

		// создание кнопок для датумов и оцениваний
		if (!subjectCode) {
			tdSubject.textContent = '';
		} else {
			const dateISO = formatDateLocalISO(date);

			// собираем оценивания на день для предмета
			const assessmentDatums = (assessment_data.assessment_view ? assessment_data.datums.filter(ev =>
				ev.date === dateISO && assessment_data.subject_cap.toLowerCase() === subjectCode.toLowerCase()
			) : []);

			// собираем обычные "мои" датумы на этот день
			const myDatums = student_datums_data.filter(d =>
				d.date === dateISO && d.subject_cap.toLowerCase() === subjectCode.toLowerCase()
			);

			if (assessmentDatums.length > 0) {
				// === Датумы оценивания ===
				const total = assessmentDatums.length;
				const owned = assessmentDatums.filter(d => d.student != null).length;
				const myOwned = assessmentDatums.some(d => d.student === menu_data.student_data.username);
				const btn = document.createElement('button');
				btn.type = 'button';
				btn.className = 'btn btn-small text-start w-auto';
			
				if (myOwned) btn.classList.add('event-MY');
				else if (owned === total) btn.classList.add('event-OWN');
				else btn.classList.add('event-FRE');
			
				btn.textContent = `${subjectCode.toUpperCase()} ${owned}/${total}`;
			
				btn.addEventListener('click', () => {
					showAssessmentDatumDetails(
						assessmentDatums,                 // массив датумов на день для предмета
						assessment_data,        // тип (UST/PIS)
						formatDateLocalISO(date),         // дата
						// assessment_data.label             // описание
					);
				});

			
				tdSubject.appendChild(btn);
			
			} else if (myDatums.length > 0) {
				// === Обычные мои датумы ===
				const total = myDatums.length;
				const btn = document.createElement('button');
				btn.type = 'button';
				btn.className = 'btn btn-small text-start w-auto';
			
				const isPIS = myDatums.some(d => d.type_cap === 'PIS');
				btn.classList.add(isPIS ? 'btn-danger' : 'btn-primary');
			
				btn.textContent = `${subjectCode.toUpperCase()}`;
			
				btn.addEventListener('click', () => {
					// Открыть модалку для обычного датума
					showMyDatumDetails(myDatums[0].code);
				});
			
				tdSubject.appendChild(btn);
			
			} else {
				tdSubject.textContent = subjectCode.toUpperCase();
			}

		}

		// // создание кнопок вместо строк для датумов
		// if (!subjectCode) {
		// 	tdSubject.textContent = '';
		// } else {
		// 	const datums = student_datums_data.filter(d => d.date === dateISO && d.subject_cap.toLowerCase() === subjectCode.toLowerCase());

		// 	if (datums.length > 0) {
		// 		datums.forEach(datum => {
		// 			const btn = document.createElement('button');
		// 			btn.type = 'button';
		// 			btn.className = 'btn btn-small text-start w-auto ' + (datum.type_cap === 'PIS' ? 'btn-danger' : 'btn-primary');
		// 			btn.textContent = `${datum.subject_cap}`;
		// 			btn.style.width = '100%';

		// 			btn.addEventListener('click', () => {
		// 				showDatumDetails(datum.code);
		// 			});

		// 			tdSubject.appendChild(btn);
		// 		});
		// 	} else {
		// 		tdSubject.textContent = subjectCode.toUpperCase();
		// 	}
		// }
		// финалочка
		tr.appendChild(tdSubject);
		tbody.appendChild(tr);
	}

	// финалочка 2
	table.appendChild(tbody);

	lessonListEl.innerHTML = '';
	lessonListEl.appendChild(table);

	offcanvas.show();
}
