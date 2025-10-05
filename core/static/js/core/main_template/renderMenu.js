// import { menu_data } from './temp_data.js';

// Временно так, потом через fetch('api_link')

   
let menu_data = null;

async function loadMenuData() {
    const res = await fetch("/api/students/menu_data", {
        headers: { "Content-Type": "application/json" },
        credentials: "include"
    });
    menu_data = await res.json();
    return menu_data; // можно вернуть, чтобы использовать в другой функции
}

// пример
loadMenuData().then(data => {
    console.log("menu_data загружен:", data);
    renderMenu(data); // тут реально можно использовать
});



function setText(id, text) {
    const el = document.getElementById(id);
    if (el) {
        el.textContent = text;
    }
}

function renderMenu(data) {

    setText("user_firstname", menu_data.student_data.firstname);
    setText("user_lastname", menu_data.student_data.lastname);
    setText("username", menu_data.student_data.username);
    setText("user_money", menu_data.student_data.money);
    setText("user_jc", menu_data.student_data.justice_coefficient);

    if (menu_data.student_data.status) { 
        const moneyEl = document.getElementById("user_money_btn");
        const jcEl = document.getElementById("user_jc_btn");

        moneyEl.style.setProperty("display", "none", "important");
        jcEl.style.setProperty("display", "none", "important");
    }

    // Нотификации

    const notifStyles = {
        "assessment": {
            "bg_color": "bg-primary",
            "text_color": "text-white",
            "time_color": "text-secondary-emphasis",
            "icon": "bi-calendar-week"
        },
        "datum": {
            "bg_color": "bg-warning",
            "text_color": "text-dark",
            "time_color": "text-secondary",
            "icon": "bi-calendar-date"
        },
        "money": {
            "bg_color": "bg-dark",
            "text_color": "text-white",
            "time_color": "text-secondary",
            "icon": "bi-coin"
        },
        "justice_coefficient": {
            "bg_color": "bg-dark",
            "text_color": "text-white",
            "time_color": "text-secondary",
            "icon": "bi-info-circle"
        },
        "swap": {
            "bg_color": "bg-warning",
            "text_color": "text-dark",
            "time_color": "text-secondary",
            "icon": "bi-shuffle"
        },
        "system_message": {
            "bg_color": "bg-dark",
            "text_color": "text-white",
            "time_color": "text-secondary",
            "icon": "bi-code-slash"
        },
        "penalty": {
            "bg_color": "bg-danger",
            "text_color": "text-white",
            "time_color": "text-secondary-emphasis",
            "icon": "bi-slash_square"
        }
    };

    function formatDate(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleString('sl-SI', {
            day: 'numeric',
            month: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    function renderNotifications(data) {
        const container = document.getElementById('notifications');
        container.innerHTML = ''; // очистить

        data.notifications.forEach(notif => {
            const style = notifStyles[notif.type] || {
                bg_color: 'bg-secondary',
                text_color: 'text-white',
                time_color: 'text-secondary',
                icon: 'bi-info-circle'
            };

            const btn = document.createElement('button');
            btn.className = `list-group-item ${style.bg_color} ${style.text_color} px-4 py-3 border-0`;
            btn.type = 'button';

            // если есть ссылка, добавляем переход по клику
            if (notif.link && notif.link.trim() !== '') {
                btn.onclick = () => { window.location.href = notif.link };
            }

            btn.innerHTML = `
                <div class="small ${style.time_color} mb-1 text-start">${formatDate(notif.time)}</div>
                <div class="d-flex align-items-center text-start">
                    <i class="bi ${style.icon} me-3 fs-5"></i>
                    <div class="flex-grow-1">${notif.text}</div>
                </div>
            `;

            container.appendChild(btn);
        });
    }

    // Вызовем функцию с menu_data из твоего скрипта
    renderNotifications(menu_data);

    // Показываем красную точку, если хотя бы одно уведомление с unread=true
    const notifBadge = document.getElementById("notif-badge");
    const hasUnread = menu_data.notifications.some(n => n.unread === true);
    if (notifBadge) {
        notifBadge.style.display = hasUnread ? "block" : "none";
    }

    // изменение unread в нотификациях при открытии шторки уведомлений

    document.addEventListener("DOMContentLoaded", () => {
        const notifIcon = document.getElementById("notif-icon");
        if (!notifIcon) return;
        
        notifIcon.addEventListener("click", () => {
            const changedNotifications = menu_data.notifications
            .filter(n => n.unread)
            .map(n => ({ code: n.code, unread: false }));
        
            console.log(JSON.stringify(changedNotifications, null, 2));
        });
    });
}