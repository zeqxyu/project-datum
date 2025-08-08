from django.db import models
from students.models import Class, Student
from schedules.models import Subject

# Create your models here.

DATUM_STAGE_CHOICES = [
	(0, "announced"),
	(1, "rating"),
	(2, "sale"),
	(3, "distributed"),
]

class Assessment(models.Model):
	code = models.CharField(max_length=50, unique=True) # 1a24_matust1
	class_ref = models.ForeignKey(Class, on_delete=models.CASCADE, related_name='assesments') # 
	name = models.CharField(max_length=100) # 
	subject = models.ForeignKey("schedules.Subject", on_delete=models.CASCADE)
	type = models.CharField(max_length=5, choices=[("ust", "Ustno"), ("pis", "Pismeno")])
	stage = models.IntegerField(default=0, choices=[
		(0, "announced"),
		(1, "rating"),
		(2, "sale"),
		(3, "distributed"),
	])  # 0=announced, 1=rating, 2=sale, 3=distributed
    # stage зависит от прилежащих датумов. Когда у всех >=1, у ассесмента 1, иначе ниже
	label = models.CharField(max_length=100, blank=True) # примечания

	def __str__(self):
		return self.code 


class Datum(models.Model):
	code = models.CharField(max_length=50, unique=True) # пример 1a24_matust1_01
	assessment_ref = models.ForeignKey(Assessment, on_delete=models.CASCADE, related_name='datums') # ссылка
	date = models.DateField() # день, дата
	student = models.ForeignKey(Student, on_delete=models.SET_NULL, null=True, blank=True)
	price = models.IntegerField(default=0, null=True) # актуальная цена
	rating = models.IntegerField(default=0, null=True) # рейтинг при оценивании
	stage = models.IntegerField(default=0, choices=[
		(0, "announced"),
		(1, "rating"),
		(2, "sale"),
		(3, "distributed"),
	]) # стадия, если неопределенно, наследуется от assesment
	label = models.CharField(max_length=100, blank=True) # Коммент

	def __str__(self):
		return self.code

class DatumDiscount(models.Model):
	student = models.ForeignKey(Student, on_delete=models.CASCADE)
	datum = models.ForeignKey("Datum", on_delete=models.CASCADE)
	discount = models.FloatField() # 20% -> 0.20 
	reason = models.CharField(max_length=20, choices=[
		("liked", "Liked"),
		("disliked", "Disliked"),
		("justice", "Justice"),
	])

	def __str__(self):
		return f"{self.student.username} → {self.datum.code} ({self.discount * 100:.0f}%)"

class Swap(models.Model):
	# кто кинул запрос
	student_a = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='swaps_requested')
    # кто на него отвечает
	student_b = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='swaps_received')
	datum_a = models.ForeignKey(Datum, on_delete=models.CASCADE, related_name='swaps_a')
	datum_b = models.ForeignKey(Datum, on_delete=models.CASCADE, related_name='swaps_b')
    # цена на которой остановились
	current_price = models.PositiveIntegerField(default=0)
    # ...
	status = models.IntegerField(default=0, choices=[
		(0, 'requested'),
		(1, 'responsed'),
		(2, 'accepted'),
		(3, 'rejected')
	])
	transaction = models.name = models.ForeignKey('logs.TransactionLog', related_name='swap', on_delete=models.CASCADE)

	# Принцип работы свопов: А кидает запрос на своп, предлагает свой датум А взамен за датум Б
	# Затем А предлагает свою цену -> requested
	# Б может изменить цену или нет (если согласится) -> responsed
	# либо поменять статус сразу на rejected
	# Если А согласится заплатить финальную цену, то -> accepted
	# Иначе А меняет на rejected


	def __str__(self):
		return f"Swap: {self.student_a} → {self.student_b} | {self.status} | {self.current_price}€"
