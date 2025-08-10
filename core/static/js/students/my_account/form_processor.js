document.getElementById('accountForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Отменяем стандартную отправку формы

    const data = {
      username: document.getElementById('inputUsername').value,
      first_name: document.getElementById('inputName').value,
      last_name: document.getElementById('inputLastName').value,
      email: document.getElementById('inputEmail').value,
      phone: document.getElementById('inputTelefon').value,
      snapchat: document.getElementById('inputSnapchat').value,
    };

    console.log(JSON.stringify(data, null, 2));
});