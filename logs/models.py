from django.db import models

from django.utils import timezone

from students.models import Student, Class
from assessments.models import Datum, Assessment, Swap

# Create your models here.

class TransactionLog(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    datum = models.ForeignKey(Datum, on_delete=models.CASCADE)
    amount = models.FloatField()
    timestamp = models.DateTimeField(default=timezone.now)
    type = models.CharField(max_length=20, choices=[
        ("purchase", "Purchase"),
        ("refund", "Refund"),
        ("adjustment", "Adjustment"),
    ])

    def __str__(self):
        return f"{self.type.capitalize()} by {self.student} on {self.datum} ({self.amount})"


class RatingLog(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE) # кто поставил
    datum = models.ForeignKey(Datum, on_delete=models.CASCADE) # 
    rating = models.IntegerField(choices=[(-1,'-1'),(1,'+1')]) # какой поставил (-1 либо 1)
    timestamp = models.DateTimeField(default=timezone.now) # 

    def __str__(self):
        return f"{self.student} rated {self.datum} as {self.rating}"


class DatumLog(models.Model):
	timestamp = models.DateTimeField(auto_now_add=True)
    # от кого перешел. Если нулл - от системы
	from_student = models.ForeignKey(Student, null=True, blank=True, on_delete=models.SET_NULL, related_name='datumlog_from')
	# кому перешел. Если от=кому то ниче не изменилось. Если нулл - вникуда
	to_student = models.ForeignKey(Student, null=True, blank=True, on_delete=models.SET_NULL, related_name='datumlog_to')
	datum = models.ForeignKey(Datum, on_delete=models.CASCADE, related_name='logs')
	# если была транзакция
	current_date = models.DateField(null=True, blank=True)  # если изменили дату датума
	current_label = models.DateField(null=True, blank=True)  # если изменили лейбл датума
	comment = models.TextField(blank=True)
	current_stage = models.IntegerField(choices=[
		(0, 'announced'),
		(1, 'rating'),
		(2, 'sale'),
		(3, 'distributed'),
	], default=0)
	update = models.CharField(max_length=20, choices=[
		('sold', 'Sold'), # Купили
		('rated', 'Rated'), # оценили
		('swapped', 'Swapped'), # заменили
		('changed', 'Changed'), # изменилась дата / лейбл или еще чето
	], blank=True)

	 # Связанные операции
	transaction = models.ForeignKey('logs.TransactionLog', null=True, blank=True, on_delete=models.SET_NULL, related_name='datum_logs')
	swap = models.ForeignKey('assessments.Swap', null=True, blank=True, on_delete=models.SET_NULL, related_name='datum_logs')
	rating = models.ForeignKey('logs.RatingLog', null=True, blank=True, on_delete=models.SET_NULL, related_name='datum_logs')


	def __str__(self):
		return f"DatumLog {self.id} for {self.datum.code} at {self.time}"

class JusticeCoefficientLog(models.Model):
	timestamp = models.DateTimeField(auto_now_add=True)
	student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='justice_logs')
	datum = models.ForeignKey(Datum, on_delete=models.SET_NULL, null=True, blank=True, related_name='justice_logs')
	from_jc = models.FloatField()  # Коэффициент справедливости до изменения
	to_jc = models.FloatField()    # Коэффициент справедливости после изменения
	way = models.CharField(max_length=20, choices=[
		('random', 'Random Datum'),
		('rated', 'Rated Datum'),
		# можно добавить другие способы
	])
	comment = models.TextField(blank=True)

	def __str__(self):
		return f"JusticeCoefficientLog for {self.student.username} on {self.time}"

class PenaltyLog(models.Model):
	student = models.ForeignKey(Student, on_delete=models.CASCADE)
	reason = models.CharField(max_length=255) # кастомный текст
	type = models.IntegerField(default=0, choices=[
		(0, 'penalty'),
		(1, 'cancellation')
	])
	value = models.FloatField() # размер штрафа
	timestamp = models.DateTimeField(default=timezone.now)

	def __str__(self):
		return f"Penalty: {self.student} - {self.amount} ({self.reason})"


class AssessmentLog(models.Model):
    assessment = models.ForeignKey(Assessment, on_delete=models.CASCADE)
    stage_before = models.IntegerField() # стадия по 0-1-2-3 см. assesments.models
    stage_after = models.IntegerField() # -//-
    timestamp = models.DateTimeField(default=timezone.now)
    comment = models.TextField(blank=True) # кастомное поле

    def __str__(self):
        return f"Assessment {self.assesment} stage {self.stage_before}->{self.stage_after}"

class SwapLog(models.Model):
    swap = models.ForeignKey(Swap, on_delete=models.CASCADE, related_name='logs')
    timestamp = models.DateTimeField(auto_now_add=True)
    current_price = models.PositiveIntegerField() # если изменили цену
    new_status = models.IntegerField(default=0, choices=[
        (0, 'requested'),
        (1, 'responsed'),
        (2, 'accepted'),
        (3, 'rejected')
    ])
    message = models.TextField(blank=True) # кастомное

    def __str__(self):
        return f"SwapLog [{self.time}]: {self.student_a} → {self.student_b} ({self.new_status})"

class ClassLog(models.Model):
	class UpdateType(models.TextChoices):
		STUDENT = 'student', 'Student Changed'
		NAME = 'name', 'Class Name Changed'
		PRESIDENT = 'president', 'President Changed'

	class_ref = models.ForeignKey(Class, on_delete=models.CASCADE, related_name='logs')
	time = models.DateTimeField(auto_now_add=True)
	update_type = models.CharField(max_length=10, choices=UpdateType.choices)

	new_student = models.ForeignKey(Student, on_delete=models.SET_NULL, null=True, blank=True, related_name='classlog_student')
	current_name = models.CharField(max_length=20, null=True, blank=True)
	new_president = models.ForeignKey(Student, on_delete=models.SET_NULL, null=True, blank=True, related_name='classlog_president')

	comment = models.TextField(blank=True)

	def __str__(self):
		return f"ClassLog [{self.time}] - {self.class_ref.name} - {self.update_type}"

class Notification(models.Model):
	TYPE_CHOICES = [
        ('assessment', 'Оценки / задания'),
        ('money', 'Финансы'),
        ('justice_coefficient', 'Коэффициент справедливости'),
        ('system_message', 'Системные сообщения'),
        ('swap', 'Обмен / замены'),
        ('penalty', 'Штрафы'),
        ('datum', 'Датумы'),
    ]

	student = models.ForeignKey(Student, on_delete=models.CASCADE)
	type = models.CharField(max_length=20, choices=TYPE_CHOICES),
	timestamp = models.DateTimeField(auto_now_add=True),
	text = models.CharField(max_length=100, null=True, blank=True),
	link = models.CharField(max_length=100, null=True, blank=True)