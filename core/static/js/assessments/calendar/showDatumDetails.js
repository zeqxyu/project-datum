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

export function showAssessmentDatumDetails(assessmentDatums, assessment_data, date) {
	const type = assessment_data.type_cap;
	const subject = assessment_data.subject_cap;

	const modalEl = document.getElementById('assessmentDatumModal');
	const modal = new bootstrap.Modal(modalEl);

	// const hasAnyDatum = assessment_data.datums.some(d => d.student === menu_data.student_data.username);
	const hasAnyDatum = false;

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
		addRow('Student', datum.student_fullname, datum.student);
		addRow('Rating', datum.rating);
		addRow('Price', datum.price);
		addRow('Label', datum.label);

		table.appendChild(tbody);
		container.appendChild(table);

		// добавить кнопки по условиям
		const btnWrapper = document.createElement('div');
		btnWrapper.className = 'd-flex justify-content-end gap-2 mb-4';

		// стадия 0 - только статусники
		if (!hasAnyDatum && datum.student == null && menu_data.student_data.status === true && assessment_data.stage === 0) {
			const selectBtn = document.createElement('button');
			selectBtn.className = 'btn btn-primary btn-sm';
			selectBtn.textContent = 'Выбрать';
			// тут вешаешь обработчик:
			selectBtn.addEventListener('click', () => {
				console.log('Выбрать datum:', datum.code);
				// TODO: сюда действие выбора
			});
			btnWrapper.appendChild(selectBtn);
		}
		// стадия 2 - свободные датумы
		if (!hasAnyDatum && datum.student == null && assessment_data.stage === 2) {
			const buyBtn = document.createElement('button');
			buyBtn.className = 'btn btn-success btn-sm';
			buyBtn.textContent = 'Купить';
			buyBtn.addEventListener('click', () => {
				console.log('Купить datum:', datum.code);
				// TODO: сюда действие покупки
			});
			btnWrapper.appendChild(buyBtn);
		}
		// стадия 3 - своп
		if (datum.student != null && datum.student != menu_data.student_data.username && assessment_data.stage === 3) {
			const buyBtn = document.createElement('button');
			buyBtn.className = 'btn btn-success btn-sm';
			buyBtn.textContent = 'Купить';
			buyBtn.addEventListener('click', () => {
				console.log('Купить datum:', datum.code);
				// TODO: сюда действие покупки
			});
			btnWrapper.appendChild(buyBtn);
		}

		container.appendChild(btnWrapper);


		// Подсветка по статусу
		if (datum.student == null) {
			table.style.boxShadow = '0 0 10px rgba(0, 255, 0, 0.6)'; // свободный — зеленый
		} else if (datum.student == menu_data.student_data.username) {
			table.style.boxShadow = '0 0 10px rgba(255, 255, 0, 0.7)'; // твой — желтый
		} else {
			table.style.boxShadow = '0 0 10px rgba(255, 0, 0, 0.6)'; // занят — красный
		}
	});

	// Инициализация поповеров
	const popoverTriggerList = [].slice.call(modalEl.querySelectorAll('[data-bs-toggle="popover"]'));
	popoverTriggerList.map(popEl => new bootstrap.Popover(popEl));

	modal.show();
}