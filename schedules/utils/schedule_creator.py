from django.core.management.base import BaseCommand

from schedules.models import Schedule, ScheduleSlot, Subject
from students.models import Class

from datetime import date, timedelta

from utils.cmdout import success, warning, error


def create_schedule(data):
	class_code = data["class_code"]
	
	try:
		class_ref = Class.objects.get(code=class_code)
	except Class.DoesNotExist:
		error(f"Класс с кодом {username} не найден.")
		return

	valid_from = data["valid_from"]
	comment = data["comment"]

	new_schedule = Schedule.objects.create(
		class_ref=class_ref,
		valid_from=valid_from,
		comment=comment
	)

	for day_index, day in enumerate(data["schedule"]):
		if day is not None:
			for hour_index, lesson_code in enumerate(day):
				if lesson_code is None:
					continue
				try:
					subject = Subject.objects.get(code=lesson_code)
				except Subject.DoesNotExist:
					print(f"Предмет с кодом {lesson_code} не найден")
					continue

				subject = Subject.objects.get(code=lesson_code)
				ScheduleSlot.objects.create(
					schedule=new_schedule,
					day=day_index,
					hour=hour_index,
					subject=subject
				)
