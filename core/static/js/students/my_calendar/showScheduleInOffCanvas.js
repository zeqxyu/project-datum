import { student_datums_data, schedule_data } from '/static/js/students/my_calendar/temp_data.js';
import { showDatumDetails } from '/static/js/students/my_calendar/showDatumDetails.js';
import { formatDateLocalISO } from '/static/js/students/my_calendar/renderCalendar.js';

const dayOffcanvasEl = document.getElementById("dayOffcanvas");
const dayTitleEl = document.getElementById("dayTitle");
const lessonListEl = document.getElementById("lessonList");
const offcanvas = new bootstrap.Offcanvas(dayOffcanvasEl);

function getWeekdayShortName(dayNum) {
	const days = ['NE', 'PO', 'TO', 'SR', 'ČE', 'PE', 'SO', 'NE'];
	return days[dayNum] || '';
}

function formatDateWithWeekday(date) {
	const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
	const dateStr = date.toLocaleDateString('sl-SI', options);
	const weekday = getWeekdayShortName(date.getDay());
	return `${dateStr} (${weekday})`;
}


export function showScheduleInOffcanvas(date) {
	const dayOfWeek = date.getDay();

	if (dayOfWeek < 1 || dayOfWeek > 5) {
		dayTitleEl.textContent = formatDateWithWeekday(date);
		lessonListEl.innerHTML = '<em>Ta dan ni šolski dan.</em>';
		offcanvas.show();
		return;
	}

	const scheduleForDay = schedule_data.schedule[dayOfWeek];
	dayTitleEl.textContent = formatDateWithWeekday(date);

	if (!scheduleForDay) {
		lessonListEl.innerHTML = '<em>Ni razporeda za ta dan.</em>';
		offcanvas.show();
		return;
	}

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

	for (let lessonNum = 0; lessonNum < scheduleForDay.length; lessonNum++) {
		const tr = document.createElement('tr');

		const tdNum = document.createElement('th');
		tdNum.scope = 'row';
		tdNum.textContent = lessonNum;
		tr.appendChild(tdNum);

		const tdSubject = document.createElement('td');
		const subjectCode = scheduleForDay[lessonNum];

		if (!subjectCode) {
			tdSubject.textContent = '';
		} else {
			const datums = student_datums_data.filter(d => d.date === dateISO && d.subject_cap.toLowerCase() === subjectCode.toLowerCase());

			if (datums.length > 0) {
				datums.forEach(datum => {
					const btn = document.createElement('button');
					btn.type = 'button';
					btn.className = 'btn btn-small text-start w-auto ' + (datum.type_cap === 'PIS' ? 'btn-danger' : 'btn-primary');
					btn.textContent = `${datum.subject_cap}`;
					btn.style.width = '100%';

					btn.addEventListener('click', () => {
						showDatumDetails(datum.code);
					});

					tdSubject.appendChild(btn);
				});
			} else {
				tdSubject.textContent = subjectCode.toUpperCase();
			}
		}

		tr.appendChild(tdSubject);
		tbody.appendChild(tr);
	}

	table.appendChild(tbody);

	lessonListEl.innerHTML = '';
	lessonListEl.appendChild(table);

	offcanvas.show();
}
