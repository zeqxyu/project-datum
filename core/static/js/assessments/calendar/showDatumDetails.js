import { student_datums_data } from '/static/js/assessments/calendar/temp_data.js';

export function formatDateSlovenian(dateStr) {
	const d = new Date(dateStr);
	const day = d.getDate().toString().padStart(2, '0');
	const month = (d.getMonth() + 1).toString().padStart(2, '0');
	const year = d.getFullYear();
	return `${day}.${month}.${year}`;
}

export function showMyDatumDetails(code) {
	if (!Array.isArray(student_datums_data)) {
		console.error('student_datums_data не загружен');
		return;
	}
	const datum = student_datums_data.find(d => d.code === code);
	if (!datum) {
		console.error('Datum не найден для кода:', code);
		return;
	}

	document.getElementById('datumCode').textContent = datum.code;
	document.getElementById('datumSubject').textContent = datum.subject_cap;
	document.getElementById('datumType').textContent = datum.type_cap;
	document.getElementById('datumDate').textContent = formatDateSlovenian(datum.date);
	document.getElementById('datumLabel').textContent = datum.label || '';
	document.getElementById('datumLink').href = `/assessments/${datum.code.slice(0, -3)}`;
	document.getElementById('datumSwap').href = `/logs/datum/${datum.code}`;

	new bootstrap.Modal(document.getElementById('datumModal')).show();
}

import { menu_data } from '/static/js/core/main_template/temp_data.js';

export function showAssessmentDatumDetails(assessmentDatums, subject, type, date, label) {
	const modalEl = document.getElementById('assessmentDatumModal');
	const modal = new bootstrap.Modal(modalEl);

	// Верхняя часть (основная информация)
	document.getElementById('assessmentDatumSubject').textContent = subject;
	document.getElementById('assessmentDatumType').textContent = type;
	document.getElementById('assessmentDatumDate').textContent = date;
	document.getElementById('assessmentDatumLabel').textContent = label;

	// tbody для списка датумов
	const tableBodyEl = document.getElementById('assessmentDatumList');
	tableBodyEl.innerHTML = ''; // очистка предыдущих строк

	assessmentDatums.forEach((datum, index) => {
		const tr = document.createElement('tr');

		// Номер
		const th = document.createElement('th');
		th.scope = 'row';
		th.textContent = index + 1;
		tr.appendChild(th);

		// Code
		const tdCode = document.createElement('td');
		tdCode.textContent = datum.code;
		tr.appendChild(tdCode);

		// Student
		const tdStudent = document.createElement('td');
		tdStudent.textContent = datum.student_name || '-';

		if (datum.student_username) {
			const info = document.createElement('span');
			info.dataset.bsToggle = 'popover';
			info.dataset.bsContent = `username: ${datum.student_username}`;
			info.textContent = ' ℹ️';
			tdStudent.appendChild(info);
		}

		tr.appendChild(tdStudent);

		// Rating
		const tdRating = document.createElement('td');
		tdRating.textContent = datum.rating != null ? datum.rating : '-';
		tr.appendChild(tdRating);

		// Price
		const tdPrice = document.createElement('td');
		tdPrice.textContent = datum.price != null ? datum.price : '-';
		tr.appendChild(tdPrice);

		tableBodyEl.appendChild(tr);
	});

	// Поповеры
	const popoverTriggerList = [].slice.call(modalEl.querySelectorAll('[data-bs-toggle="popover"]'));
	popoverTriggerList.map(popEl => new bootstrap.Popover(popEl));

	// Открыть модалку
	modal.show();
}
