from django.core.management.base import BaseCommand
from schedules.models import Schedule
from students.models import Class, Student
from datetime import date, timedelta
import random

from schedules.utils.schedule_creator import create_schedule
from utils.cmdout import success, warning, error

data = {
	"class_code": "1a24",
	"valid_from": "2024-09-01",
	"comment": "My comment jopa pidor.",
	"schedule": [
		None,
		[
			None,
			"zgo",
			"ang",
			"svz",
			"slj",
			"fiz",
			"inf",
			"inf"
		],
		[
			None,
			"slj",
			"slj",
			"bio",
			"ita",
			"geo",
			"fiz"
		],
		[
			None,
			"fiz",
			"svz",
			"svz",
			"mat",
			"zgo",
			"ang",
			"kem"
		],
		[
			None,
			"bio",
			"ita",
			"slj",
			"ang",
			"mat",
			"mat",
			"gla"
		],
		[
			None,
			"inf",
			"inf",
			"ita",
			"fiz",
			"mat",
			"geo",
			"lum"
		]
	]
}

class Command(BaseCommand):
	help = "Генерирует расписание для заданного класса из списка"

	def handle(self, *args, **options):
		create_schedule(data)
		success("Schedule created successfully")

	pass