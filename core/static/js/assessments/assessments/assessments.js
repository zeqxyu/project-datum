import { assessments_data } from "./temp_data.js";

const container = document.querySelector('.container');

function createProgressBar(stage) {
const iconNames = [
    'bi-plus-circle',
    'bi-plus-slash-minus',
    'bi-shop',
    'bi-check-circle',
];

let iconClasses, lineClasses, statusClass;

if (stage === 0) {
    iconClasses = ['text-warning', 'text-white', 'text-white', 'text-white'];
    lineClasses = ['line-white', 'line-white', 'line-white'];
    statusClass = 'text-white';
} else if (stage === 1) {
    iconClasses = ['text-warning', 'text-warning', 'text-white', 'text-white'];
    lineClasses = ['line-warning', 'line-white', 'line-white'];
    statusClass = 'text-warning';
} else if (stage === 2) {
    iconClasses = ['text-warning', 'text-warning', 'text-warning', 'text-white'];
    lineClasses = ['line-warning', 'line-warning', 'line-white'];
    statusClass = 'text-warning';
} else if (stage === 3) {
    iconClasses = ['text-success', 'text-success', 'text-success', 'text-success'];
    lineClasses = ['line-success', 'line-success', 'line-success'];
    statusClass = 'text-success';
} else {
    iconClasses = ['text-white', 'text-white', 'text-white', 'text-white'];
    lineClasses = ['line-white', 'line-white', 'line-white'];
    statusClass = 'text-secondary';
}

const progressBar = document.createElement('div');
progressBar.className = 'progress-bar-custom';

for (let i = 0; i < 4; i++) {
    const icon = document.createElement('i');
    icon.className = `bi ${iconNames[i]} ${iconClasses[i]}`;
    progressBar.appendChild(icon);

    if (i < 3) {
    const line = document.createElement('div');
    line.className = `line ${lineClasses[i]}`;
    progressBar.appendChild(line);
    }
}

return { progressBar, statusClass };
}

function createCard(assessment) {
const card = document.createElement('div');
card.className = 'card mb-3 shadow-sm';
card.style.borderLeft = assessment.type_cap === 'PIS' ? '6px solid var(--bs-danger)' : '6px solid var(--bs-primary)';
card.style.cursor = 'pointer';

card.addEventListener('click', () => {
    window.location.href = `/assessment/${assessment.code}`;
});

const cardBody = document.createElement('div');
cardBody.className = 'card-body d-flex justify-content-between';

// Left content
const leftDiv = document.createElement('div');
leftDiv.innerHTML = `<h5 class="card-title mb-2">${assessment.name}</h5>
                    <span class="badge bg-${assessment.type_cap === 'PIS' ? 'danger' : 'primary'}" style="font-size:1rem;">${assessment.subject_cap}</span>`;

cardBody.appendChild(leftDiv);

// Right content
const rightDiv = document.createElement('div');
rightDiv.style.textAlign = 'right';
rightDiv.style.display = 'flex';
rightDiv.style.flexDirection = 'column';
rightDiv.style.alignItems = 'flex-end';
rightDiv.style.justifyContent = 'center';

if (assessment.type_cap === 'UST') {
    const { progressBar, statusClass } = createProgressBar(assessment.stage);
    rightDiv.appendChild(progressBar);

    const statusText = document.createElement('div');
    statusText.className = `status-text ${statusClass}`;
    statusText.textContent = assessment.stage_text;
    rightDiv.appendChild(statusText);

} else if (assessment.type_cap === 'PIS') {
    const statusText = document.createElement('div');
    statusText.className = 'status-text';
    statusText.textContent = assessment.date ? `Datum: ${assessment.date}` : 'Datum ni določen';
    rightDiv.appendChild(statusText);
}

cardBody.appendChild(rightDiv);
card.appendChild(cardBody);

return card;
}

function renderAssessments(data) {
const container = document.querySelector('.container');
for (const assessment of data.assessments) {
    const card = createCard(assessment);
    container.appendChild(card);
}
}

renderAssessments(assessments_data);

import {menu_data} from '/static/js/core/main_template/temp_data.js'

document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('add-assessment-btn');
    if (!btn) return;
  
    // Сначала скрываем кнопку по умолчанию (если не сделано в HTML)
    btn.style.display = 'none';
  
    // Проверяем условие
    if (menu_data.student_data.is_president === true) {
      btn.style.display = 'block';
    }
});