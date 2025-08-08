# вспомогательный код который заполняет БД предметами. Полезно при очистке БД

from django.core.management.base import BaseCommand
from schedules.models import Schedule, Subject
from students.models import Class, Student
from datetime import date, timedelta
import random

from schedules.utils.schedule_creator import create_schedule
from utils.cmdout import success, warning, error

subject_list = [
	# SPLOŠNO
	("mat", "Matematika"),
	("fiz", "Fizika"),
	("slj", "Slovenščina"),
	("ita", "Italijanščina"),
	("ang", "Angleščina"),
	("svz", "Športna vzgoja"),
	("bio", "Biologija"),
	("kem", "Kemija"),
	("geo", "Geografija"),
	("zgo", "Zgodovina"),
	# 1 LETNIK
	("inf", "Informatika"),
	("gla", "Glasba"),
	("lum", "Likovna umetnost"),
	# 2 LETNIK
	("psi", "Psihologija"),
	# 3 LETNIK
	("soc", "Sociologija"),
	# 4 LETNIK
	("fil", "Filozofija")
	# UMETNIŠKA
	# ŠPORTNA
]

class Command(BaseCommand):
	help = "Заполняет БД предметами. Удобно после очистки БД."

	def handle(self, *args, **options):
		for subject in subject_list:
			Subject.objects.create(
				code=subject[0],
				name=subject[1]
			)
			print(f"{subject[1]} добавлена")
		success("Все чики пуки")