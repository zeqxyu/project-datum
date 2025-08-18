# Эта команда меняет президента класса.

from django.core.management.base import BaseCommand

from django.contrib.auth.models import User
from django.contrib.auth import get_user_model

from students.models import Class, Student  # Импортируй из своего приложения

# Мои утилиты

from utils.cmdout import success, warning, error

from students.utils.username_generator import generate_username, simplify_name
from students.utils.password_generator import generate_password
from students.utils.class_code_generator import generate_class_code

from students.utils.validators.class_name_validator import validate_class_name
from students.utils.constants import start_money, start_justice_coefficient


class Command(BaseCommand):
	help = "Меняет президента класса."

	def handle(self, *args, **options):

		class_code = input("Введите код класса: ")
		try:
			class_ref = Class.objects.get(code=class_code)
		except Class.DoesNotExist:
			error(f"Класс с кодом {username} не найден.")
			return

		username = input("Введите юзернейм студента, которого хотите сделать президентом: ")
		try:
			student_ref = Student.objects.get(user_ref__username=username)
		except Student.DoesNotExist:
			error(f"Студент с юзернеймом {username} не найден.")
			return

		class_ref.president = student_ref
		class_ref.save()

		success(f"Студент {username} теперь президент класса {class_code}")

	pass