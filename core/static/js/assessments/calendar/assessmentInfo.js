import {menu_data} from '/static/js/core/main_template/temp_data.js';
import {assessment_data, student_datums_data} from '/static/js/assessments/calendar/temp_data.js';

// ======= Прогресс бар логика =======
function getStageClasses(stage) {
	let iconClasses, lineClasses, statusClass, statusText;
	if (stage === 0) {
		iconClasses = ['text-warning', 'text-white', 'text-white', 'text-white'];
		lineClasses = ['line-white', 'line-white', 'line-white'];
		statusClass = 'text-white';
		statusText = "Datumi so objavljeni";
	} else if (stage === 1) {
		iconClasses = ['text-warning', 'text-warning', 'text-white', 'text-white'];
		lineClasses = ['line-warning', 'line-white', 'line-white'];
		statusClass = 'text-warning';
		statusText = "Plus/Minus faza";
	} else if (stage === 2) {
		iconClasses = ['text-warning', 'text-warning', 'text-warning', 'text-white'];
		lineClasses = ['line-warning', 'line-warning', 'line-white'];
		statusClass = 'text-warning';
		statusText = "Razprodaja datumov";
	} else if (stage === 3) {
		iconClasses = ['text-success', 'text-success', 'text-success', 'text-success'];
		lineClasses = ['line-success', 'line-success', 'line-success'];
		statusClass = 'text-success';
		statusText = "Zaključeno";
	} else {
		iconClasses = ['text-white', 'text-white', 'text-white', 'text-white'];
		lineClasses = ['line-white', 'line-white', 'line-white'];
		statusClass = 'text-secondary';
		statusText = "Neznano";
	}
	return { iconClasses, lineClasses, statusClass, statusText };
}

// ======= Рендер карточки =======
export function renderAssessmentCard(assessment_data) {
	const { iconClasses, lineClasses, statusClass, statusText } = getStageClasses(assessment_data.stage);

	const card = document.createElement("div");
	card.className = "card mb-3 shadow-sm";
	card.style.borderLeft = "6px solid var(--bs-primary)";

    const subject_color = assessment_data.subject_cap=="PIS" ? "danger" : "primary";

	card.innerHTML = `
		<div class="card-body">
			<!-- Верхняя строка -->
			<div class="d-flex justify-content-between align-items-center mb-2">
				<h5 class="card-title mb-0">${assessment_data.name}</h5>
				<div class="progress-container d-flex flex-column align-items-end">
					<div class="progress-bar-custom d-flex align-items-center" style="width: 180px;">
						<span class="bi bi-plus-circle ${iconClasses[0]}"></span>
						<span class="line ${lineClasses[0]}" style="width: 40px;"></span>
						<span class="bi bi-plus-slash-minus ${iconClasses[1]}"></span>
						<span class="line ${lineClasses[1]}" style="width: 40px;"></span>
						<span class="bi bi-shop ${iconClasses[2]}"></span>
						<span class="line ${lineClasses[2]}" style="width: 40px;"></span>
						<span class="bi bi-check-circle ${iconClasses[3]}"></span>
					</div>
					<div class="status-text ${statusClass} mt-1">${statusText}</div>
				</div>
			</div>

			<!-- Подробности -->
			<div class="mb-3">
				<span class="badge bg-${subject_color} me-2">${assessment_data.subject_cap}</span>
				<span class="text-muted">Tip: ${assessment_data.type_cap}</span><br>
				<small class="text-muted">Opomba: ${assessment_data.label}</small>
			</div>

			<!-- Нижний блок -->
			<div class="d-flex justify-content-between align-items-center">
				<div id="aviableRatings">
					
				</div>
				<div id="assessmentBtnWrapper">
					<a href="/assessments/print/${assessment_data.code}" class="btn btn-outline-secondary btn-sm me-2">
						<i class="bi bi-printer"></i> Print
					</a>
					
				</div>
			</div>
		</div>
	`;

	document.getElementById("assessments-container").appendChild(card);

    if (menu_data.student_data.is_president === true) {
        const btnWrapper = card.querySelector("#assessmentBtnWrapper");
        const editLink = document.createElement("a");
        editLink.href = `/assessments/edit/${assessment_data.code}`;
        editLink.className = "btn btn-outline-primary btn-sm ms-2";
        editLink.innerHTML = `<i class="bi bi-pencil-square"></i> Edit`;
        btnWrapper.appendChild(editLink);
    }
    
    console.log(assessment_data.stage);
    if (assessment_data.stage === 1) {
        const aviableRatingsWrapper = card.querySelector('#aviableRatings');

        const aviableRatingsContent = document.createElement("span");
        aviableRatingsContent.innerHTML = `
            <span class="badge bg-success me-2">
                <span id="aviablePluses"></span> <span class="bi bi-plus-circle"></span>
            </span>
            <span class="badge bg-danger">
                <span id="aviableMinuses"></span> <span class="bi bi-dash-circle"></span>
            </span>
        `;

        aviableRatingsWrapper.appendChild(aviableRatingsContent);
    }
}

