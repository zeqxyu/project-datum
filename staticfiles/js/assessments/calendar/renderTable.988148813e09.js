import { formatDateDM } from "/static/js/core/utils/formatDate.js";

export function renderAssessmentTable(assessment_data) {
	const container = document.getElementById("assessment-table");

	// группируем по дате
	const grouped = {};
	assessment_data.datums.forEach(item => {
		if (!grouped[item.date]) {
			grouped[item.date] = [];
		}
        if (item.student_fullname != null) {
    		grouped[item.date].push(item.student_fullname);
        } else {grouped[item.date].push("[...]");}
    });

	// начинаем строить HTML
	let html = `
		<table class="table table-bordered table-dark">
			<thead>
				<tr>
					<th>Datum</th>
					<th>Učenci</th>
				</tr>
			</thead>
			<tbody>
	`;

	for (const date in grouped) {
		html += `
			<tr>
				<td>${formatDateDM(date)}</td>
				<td>
                    ${grouped[date].map(name => `<span style="white-space: nowrap;">${name}</span>`).join(", ")}
                </td>
			</tr>
		`;
	}

	html += `
			</tbody>
		</table>
	`;

	container.innerHTML = html;
}

// пример использования

