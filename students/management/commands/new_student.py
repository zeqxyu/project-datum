# Эта команда создает нового студента и добавляет его в класс

from django.core.management.base import BaseCommand

from django.contrib.auth.models import User
from django.contrib.auth import get_user_model

from students.models import Class, Student

import re

# Мои утилиты

from utils.cmdout import success, warning, error

from students.utils.username_generator import generate_username, simplify_name
from students.utils.password_generator import generate_password
from students.utils.validators.class_code_validator import validate_class_code
from students.utils.student_creator import create_student

from students.utils.constants import start_money, start_justice_coefficient




class Command(BaseCommand):
	help = "Создает нового студента и добавляет в класс."

	def handle(self, *args, **options):
		firstname = input("Введите имя нового студента: ")
		lastname = input("Введите фамилию нового студента: ")
		
		while True:
			status = input("Имеет ли студент статус?" + " (y/n): ").strip().lower()
			if status in ("y", "yes", "true", "1", "t"):
				status = True
				break
			elif status in ("n", "no", "false", "0", "f"):
				status = False
				break
			else:
				print("Введите 'y' или 'n'.")

		while True:
			class_code = input("Введите код класса (пример: 1a24): ").strip()
			if validate_class_code(class_code):
				break
			else:
				print("❌ Неверный формат. Введите в виде 1a24 или 2b25")


		create_student(
			firstname=firstname, 
			lastname=lastname, 
			class_code=class_code,
			status=status
		)

		print("Все чики пуки.")

	pass