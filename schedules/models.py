from django.db import models
from students.models import Class

# Create your models here.

class Subject(models.Model):
	code = models.CharField(max_length=10, unique=True) # 'mat'
	name = models.CharField(max_length=100) # 'Matematika'

	def __str__(self):
		return self.name

class Schedule(models.Model):
	class_ref = models.ForeignKey(Class, on_delete=models.CASCADE, related_name='schedules')
	valid_from = models.DateField()
	comment = models.TextField(blank=True)

	def __str__(self):
		return f"{self.class_ref.name} ({self.valid_from})"


class ScheduleSlot(models.Model):
	schedule = models.ForeignKey(Schedule, on_delete=models.CASCADE, related_name='slots')
	subject = models.ForeignKey(Subject, on_delete=models.CASCADE, null=True)
	day = models.IntegerField()  # 1-7 пон-вск
	hour = models.IntegerField()  # 0-9 урок

	def __str__(self):
		return f"{self.subject.code} on day {self.day}, hour {self.hour}"

