from django.core.management.base import BaseCommand

from students.models import Class, Student
from assessments.models import Assessment, Datum
from schedules.models import Schedule, Subject, ScheduleSlot

from utils.cmdout import success, warning, error

from tabulate import tabulate


def datum_to_dict(datum: Datum) -> dict:
	return {
		"code": datum.code,
		"assessment_ref": datum.assessment_ref.code if datum.assessment_ref else None,
		"date": datum.date.strftime("%Y-%m-%d") if datum.date else None,
		"student": datum.student.code if datum.student else None,
		"price": datum.price,
		"rating": datum.rating,
		"stage": datum.stage,
		"label": datum.label,
	}

def assessment_with_datums_dict(assessment):
	return {
		"code": assessment.code,
		"class_ref": assessment.class_ref.code if assessment.class_ref else None,
		"name": assessment.name,
		"subject": assessment.subject.code if assessment.subject else None,
		"type": assessment.type,
		"stage": assessment.stage,
		"label": assessment.label,
		"datums": [datum_to_dict(d) for d in assessment.datums.all()]
	}

def tabulate_datums(assessment_dict):
	headers = ["code", "date", "student", "price", "rating", "stage", "label"]
	rows = [
		[
			d["code"],
			d["date"],
			d["student"],
			d["price"],
			d["rating"],
			d["stage"],
			d["label"]
		]
		for d in assessment_dict.get("datums", [])
	]
	return tabulate(rows, headers=headers, tablefmt="grid")