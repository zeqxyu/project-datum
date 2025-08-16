import { student_datums_data } from '/static/js/assessments/calendar/temp_data.js';
import { menu_data } from '/static/js/core/main_template/temp_data.js'

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

export function showAssessmentDatumDetails(assessmentDatums, subject, type, date) {
	const modalEl = document.getElementById('assessmentDatumModal');
	const modal = new bootstrap.Modal(modalEl);

	// Верхняя часть (основная информация)
	document.getElementById('assessmentDatumSubject').textContent = subject;
	document.getElementById('assessmentDatumType').textContent = type;
	document.getElementById('assessmentDatumDate').textContent = date;
	// document.getElementById('assessmentDatumLabel').textContent = label;

	// Контейнер для мини-таблиц
	const container = document.getElementById('assessmentDatumList');
	container.innerHTML = ''; // очистка предыдущих

	assessmentDatums.forEach((datum, index) => {
		const table = document.createElement('table');
		table.className = 'table table-dark table-striped table-bordered mb-3';

		const tbody = document.createElement('tbody');

		const addRow = (labelText, valueText, popoverUsername) => {
			const tr = document.createElement('tr');
			const th = document.createElement('th');
			th.scope = 'row';
			th.textContent = labelText;
			const td = document.createElement('td');
			td.textContent = valueText || '-';

			if (popoverUsername) {
				const info = document.createElement('span');
				info.dataset.bsToggle = 'popover';
				info.dataset.bsContent = 'username: ${popoverUsername}';
				info.textContent = ' ℹ️';
				td.appendChild(info);
			}

			tr.appendChild(th);
			tr.appendChild(td);
			tbody.appendChild(tr);
		};

		addRow('#', (index + 1).toString());
		addRow('Code', datum.code);
		addRow('Student', datum.student_name, datum.student_username);
		addRow('Rating', datum.rating);
		addRow('Price', datum.price);
		addRow('Label', datum.label);

		table.appendChild(tbody);
		container.appendChild(table);
	});

	// Инициализация поповеров
	const popoverTriggerList = [].slice.call(modalEl.querySelectorAll('[data-bs-toggle="popover"]'));
	popoverTriggerList.map(popEl => new bootstrap.Popover(popEl));

	modal.show();
}