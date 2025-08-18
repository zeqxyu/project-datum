from django.core.management.base import BaseCommand

from django.contrib.auth.models import User
from django.contrib.auth import get_user_model

from students.models import Class, Student  # Импортируй из своего приложения

# Мои утилиты
from students.utils.username_generator import generate_username, simplify_name
from students.utils.password_generator import generate_password
from students.utils.class_code_generator import generate_class_code

from students.utils.validators.class_name_validator import validate_class_name

from utils.cmdout import success, warning, error

from students.utils.constants import start_money, start_justice_coefficient

class Command(BaseCommand):
	help = "Показывает всех студентов класса и президента."
	
	def handle(self, *args, **options):
		class_code = input("Введите код класса: ")
		try:
			class_ref = Class.objects.get(code=class_code)
		except Class.DoesNotExist:
			error(f"Класс с кодом {username} не найден.")
			return

		students_list = list(class_ref.students.all())

		if class_ref.president != None:
			success("Президент класса:\n")
			print(f"Name: {class_ref.president.user_ref.first_name} {class_ref.president.user_ref.last_name}")
			warning(f"Usrn: {class_ref.president.user_ref.username}")
			print()
		else:
			error("В классе нет президента! Назначьте его.\n")

		success("Список всех студентов:")

		if students_list != []:
			for student in students_list:
				print(f"\nName: {student.user_ref.first_name} {student.user_ref.last_name}")
				warning(f"Usrn: {student.user_ref.username}")
		else:
			error("Этот класс пока что пустой.")
		
		
		
		pass