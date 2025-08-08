from django.core.management.base import BaseCommand
from schedules.models import Schedule, ScheduleSlot, Subject
from students.models import Class, Student
from datetime import date, timedelta
import random

from schedules.utils.schedule_creator import create_schedule
from schedules.utils.schedule_to_dict import schedule_to_dict
from utils.cmdout import success, warning, error

from tabulate import tabulate

def tabulate_schedule(schedule_data):
	# Заголовки столбцов (понедельник - пятница)
	headers = ["", "PON", "TOR", "SRE", "ČET", "PET"]

	# Предположим, что schedule_data — это список списков (0-й день None, потом дни)
	schedule = schedule_data["schedule"]

	# Начнем с заголовка
	table = []

	# Кол-во часов — по длине первого непустого дня
	# По примеру у тебя до 10 (0-10)
	max_hours = max(len(day) if day else 0 for day in schedule)

	# Цикл по часам (строкам), нумерация строк с 0 до max_hours-1
	for hour in range(max_hours):
		row = [str(hour)]
		for day in schedule[1:]:  # пропускаем 0-й None, дни с 1 по 5
			if day is None or hour >= len(day):
				# Пустая ячейка
				row.append("")
			else:
				lesson = day[hour]
				if lesson is None:
					row.append("")
				else:
					row.append(lesson)
		table.append(row)

	return tabulate(table, headers=headers, tablefmt="github")

class Command(BaseCommand):
	help = "Преобразует расписание в таблицу и словарь. Показывает."

	def handle(self, *args, **options):

		schedule_obj = Schedule.objects.get(class_ref__code="1a24", valid_from="2024-09-01")
		data = schedule_to_dict(schedule_obj)
		warning(data)
		print()
		success(tabulate_schedule(data))

		pass