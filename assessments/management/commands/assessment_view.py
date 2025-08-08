from django.core.management.base import BaseCommand

from students.models import Class, Student
from assessments.models import Assessment, Datum
from schedules.models import Schedule, Subject, ScheduleSlot

from utils.cmdout import success, warning, error

from assessments.utils.datum_to_dict import datum_to_dict, assessment_with_datums_dict, tabulate_datums

class Command(BaseCommand):
	help = ""

	def handle(self, *args, **options):

		assessment_code = input("Код оценивания: ")

		try:
			assessment = Assessment.objects.get(code=assessment_code)
		except Assessment.DoesntExist():
			error(f"Оценивания {assessment_code} не существует.")
			return

		assessment_dict = assessment_with_datums_dict(assessment)

		warning(assessment_dict)
		print()
		warning("------------------------------------")
		success(f"Имя: {assessment_dict['name']}")
		warning(f"[{assessment_dict['type']}] оценивание по {assessment_dict['subject']} {assessment_dict['code']} у класса {assessment_dict['class_ref']}.")
		print(f"Стадия: {assessment_dict['stage']}")
		print(f"Примечание: {assessment_dict['label']}")
		warning("------------------------------------")

		success(tabulate_datums(assessment_dict))

		pass
