from django.core.management.base import BaseCommand

from django.contrib.auth.models import User
from django.contrib.auth import get_user_model

from students.models import Class, Student

# Мои утилиты


from students.utils.student_creator import create_student

from students.utils.constants import start_money, start_justice_coefficient

from students.utils.validators.class_code_validator import validate_class_code

from utils.cmdout import success, warning, error

# Остальные

import re

data = {
	"class_code": "1a24",
	"new_students": [
		("Marija", "Ščuka", False),
		("Taj", "Miandrušič", True),
		("Luka", "Novak", False),
		("Ana", "Kovač", False),
		("Matej", "Žagar", False),
		("Maja", "Petrič", True),
		("Žiga", "Kranjc", False),
		("Tina", "Vidmar", False),
		("Jan", "Zupančič", False),
		("Nina", "Snoj", False),
		("David", "Hribar", True),
		("Katarina", "Blatnik", False),
		("Blaž", "Zajc", False),
		("Eva", "Klemenčič", False),
		("Jure", "Gradišek", False),
		("Sara", "Vidic", False),
		("Nejc", "Zupan", False),
		("Tadej", "Kos", False),
		("Anja", "Rupnik", True),
		("Mateja", "Koren", False),
		("Miha", "Štular", False),
		("Urška", "Breznik", False),
		("Matic", "Kovačič", False),
		("Barbara", "Leban", False),
		("Jakob", "Oman", False),
		("Katja", "Šinkovec", False),
		("Andrej", "Gorenc", True)
	]
}

class Command(BaseCommand):
	help = "Пока тестовая. Добавляет учеников из dict в класс."

	def handle(self, *args, **options):

		for student in data["new_students"]:
			firstname = student[0]
			lastname = student[1]
			status = student[2]

			class_code = data["class_code"]

			created_student = create_student(
				firstname=firstname, 
				lastname=lastname, 
				class_code=class_code,
				status=status
			)

			# success(f"(i) Name: {created_student[0]} {created_student[1]}")
			# warning(f"(i) Usrn: {created_student[2]}")
			# warning(f"(i) Pswd: {created_student[3]}")
			print()
			

