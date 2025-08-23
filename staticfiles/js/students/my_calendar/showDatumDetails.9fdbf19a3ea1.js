import { student_datums_data } from '/static/js/students/my_calendar/temp_data.js';

export function formatDateSlovenian(dateStr) {
	const d = new Date(dateStr);
	const day = d.getDate().toString().padStart(2, '0');
	const month = (d.getMonth() + 1).toString().padStart(2, '0');
	const year = d.getFullYear();
	return `${day}.${month}.${year}`;
}

export function showDatumDetails(code) {
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
