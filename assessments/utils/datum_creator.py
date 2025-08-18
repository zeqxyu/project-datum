from django.core.management.base import BaseCommand

from students.models import Class, Student
from assessments.models import Assessment, Datum
from schedules.models import Schedule, Subject, ScheduleSlot

from utils.cmdout import success, warning, error



def create_datums(data):
	# ASSESSMENT
	
	# code
	assessment_code = data['code']
	
	try:
		class_ref = Class.objects.get(code=data["class_ref"])
	except Class.DoesNotExist():
		error(f"Класс {data['class_ref']} не существует.")
		return
	# name
	assessment_name = data['name']
	# subject
	try:
		subject = Subject.objects.get(code=data["subject"])
	except Class.DoesNotExist():
		error(f"Предмет {data['subject']} не существует.")
		return
	# type
	if data['type'] in ('ust', 'pis', 'pra'):
		assessment_type = data['type']
	else:
		error("Тип не соответствует формату (ust/pis/pra)")
		return
	# stage
	if data['stage'] in (0,1,2,3):
		assessment_stage = data['stage']
	else:
		error("Стадия не соответствует формату 0-3.")
		return

	# Добавление assessment в БД

	new_assessment = Assessment.objects.create(
		code=assessment_code,
		class_ref=class_ref,
		name=assessment_name,
		subject=subject,
		type=assessment_type,
		stage=assessment_stage,
		label=data['label']
	)

	success(f"[{new_assessment.type}] Оценивание по {new_assessment.subject.code} {new_assessment.code} у класса {new_assessment.class_ref.code} создано.")
	print(f"Имя: {new_assessment.name}")
	print(f"Стадия: {new_assessment.stage}")
	print(f"Примечание: {new_assessment.label}")
	warning("------------------------------------")

	# DATUMS
	

	for datum_data in data['datums']:
		datum_code = datum_data['code']
		# assessment_ref = new_assessment
		datum_date = datum_data['date']

		# student
		if datum_data['student'] is not None:
			try:
				datum_student = Student.objects.get(user_ref__username=datum_data['student'])
			except Student.DoesntExist():
				error(f"Студент {datum_data['student']} не существует.")
		else:
			datum_student = None

		datum_price = datum_data['price']
		datum_rating = datum_data['rating']
		
		# stage
		if datum_data['stage'] in (0,1,2,3):
			datum_stage = datum_data['stage']
		else:
			error("Стадия датума {datum_code} не соответствует формату 0-3.")

		datum_label = datum_data['label']

		# добавление в БД

		new_datum = Datum.objects.create(
			code=datum_code,
			assessment_ref=new_assessment,
			date=datum_date,
			student=datum_student,
			stage=datum_stage,
			rating=datum_rating,
			price=datum_price,
			label=datum_label
		)

		success(f"Датум {new_datum.code} в оценивании {new_datum.assessment_ref.code} создан.")
		print(f"День: {new_datum.date}")
		print(f"Студент: {new_datum.student}")
		print(f"Стадия: {new_datum.stage}")
		print(f"Рейтинг: {new_datum.rating}")
		print(f"Цена: {new_datum.price}")
		print(f"Примечание: {new_datum.label}")
		warning("------------------------------------")

	pass