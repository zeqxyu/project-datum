# Создает студента + юзера и добавляет в БД, привязывает к классу

from django.core.management.base import BaseCommand

from django.contrib.auth.models import User
from django.contrib.auth import get_user_model

from students.models import Class, Student  # Импортируй из своего приложения

# Мои утилиты
from students.utils.username_generator import generate_username, simplify_name
from students.utils.validators.class_name_validator import validate_class_name
from students.utils.password_generator import generate_password
from students.utils.class_code_generator import generate_class_code

from students.utils.constants import start_money, start_justice_coefficient

from utils.cmdout import success, warning, error

def create_student(firstname:str, lastname:str, class_code:str, status:bool):
	username = generate_username(firstname, lastname)
	if User.objects.filter(username=username).exists():
		print(f"Пользователь {username} уже существует!")
		return

	temp_password = generate_password()

	try:
		class_ref = Class.objects.get(code=class_code)
		class_name = Class.objects.get(code=class_code).name
	except Class.DoesNotExist:
		print(f"Класс с кодом {classcode} не найден.")
		return

	# Создание пользователя-президента
	new_user = User.objects.create_user(
		first_name=firstname,
		last_name=lastname,
		username=username, 
		password=temp_password
	)

	# Создание профиля студента
	new_student = Student.objects.create(
		user_ref=new_user,
		class_ref=class_ref,
		status=status,
		money=start_money,
		justice_coefficient=start_justice_coefficient,
		is_active=True
	)

	success(f"\nПользователь {username} с именем {firstname} {lastname} создан.")
	print(f"Он в классе {class_code} ({class_name}).")
	warning(f"Временный пароль: {temp_password}")

	return (firstname, lastname, username, temp_password)
	

	