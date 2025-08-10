import { class_data } from './temp_data.js'

// Вставка данных в DOM
document.addEventListener("DOMContentLoaded", () => {
    // Заполнение данных о классе
    document.getElementById("class_name").textContent = class_data.class_name;
    document.getElementById("class_code").textContent = class_data.class_code;
    document.getElementById("president_name").textContent = class_data.students.find(
        student => student.username === class_data.president
    ).first_name + ' ' + class_data.students.find(
        student => student.username === class_data.president
    ).last_name;

    // Заполнение списка студентов
    const tbody = document.getElementById("students_list");
    tbody.innerHTML = ""; // очистка на всякий случай

    class_data.students.forEach(student => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${student.first_name}</td>
            <td>${student.last_name}</td>
            <td>${student.username}</td>
        `;

        tbody.appendChild(tr);
    });
});