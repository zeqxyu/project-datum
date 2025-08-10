import { account_data } from '/static/js/students/my_account/temp_data.js';

document.addEventListener('DOMContentLoaded', () => {
  // Личные данные (таблица)
  document.querySelector('table:nth-of-type(1) tbody tr:nth-child(1) td').textContent = account_data.first_name;
  document.querySelector('table:nth-of-type(1) tbody tr:nth-child(2) td').textContent = account_data.last_name;
  document.querySelector('table:nth-of-type(1) tbody tr:nth-child(3) td').textContent = account_data.username;
  document.querySelector('table:nth-of-type(1) tbody tr:nth-child(4) td').textContent = account_data.email;

  // Валюта (таблица)
  const valutaTable = document.querySelector('section:nth-of-type(2) table');
  const valutaTbody = valutaTable.querySelector('tbody');

  if (account_data.status === true) {
    // Если статус true — показать алерт и скрыть таблицу
    valutaTable.style.display = 'none';

    let alertEl = document.createElement('div');
    alertEl.className = 'alert alert-secondary';
    alertEl.textContent = 'Zaradi statusa nimate razpoložljivih sredstev.';
    valutaTable.parentElement.appendChild(alertEl);
  } else {
    // Иначе заполняем таблицу
    valutaTbody.querySelector('tr:nth-child(1) td').textContent = account_data.money;
    valutaTbody.querySelector('tr:nth-child(2) td').textContent = account_data.justice_coefficient;
  }

  // Moj razred (таблица)
  const razredTbody = document.querySelector('section:nth-of-type(3) tbody');
  razredTbody.querySelector('tr:nth-child(1) td a').textContent = account_data.class_name;
  razredTbody.querySelector('tr:nth-child(1) td a').href = `/class/${account_data.class_code}`;
  razredTbody.querySelector('tr:nth-child(2) td').innerHTML = account_data.status ? '<span class="text-success">&#10004;</span> DA' : '<span class="text-danger">&#10008;</span> NE';
  razredTbody.querySelector('tr:nth-child(3) td').innerHTML = account_data.is_president ? '<span class="text-success">&#10004;</span> DA' : '<span class="text-danger">&#10008;</span> NE';

  // Форма изменения данных — подставляем value
  document.getElementById('inputName').value = account_data.first_name;
  document.getElementById('inputLastName').value = account_data.last_name;
  document.getElementById('inputUsername').value = account_data.username;
  document.getElementById('inputEmail').value = account_data.email;
  document.getElementById('inputSnapchat').value = account_data.snapchat || '';
  document.getElementById('inputTelefon').value = account_data.phone || '';
});