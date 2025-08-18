from django.db import models
from django.contrib.auth.models import User

# Create your models here.

# СТУДЕНТЫ И КЛАССЫ

class Class(models.Model):
	code = models.CharField(max_length=10, unique=True) # пример кода: 1a24, где 24 - год первого семестра класса (т.е. 2024/25)
	name = models.CharField(max_length=50) # полное имя класса, нпр 1.A
	is_active = models.BooleanField(default=True) # в случае удаления, сохранится в БД
	president = models.OneToOneField("Student", on_delete=models.SET_NULL, null=True, blank=True, related_name='class_president')

	def __str__(self):
		return self.code


class Student(models.Model):
	# рефка на модель User
	user_ref = models.OneToOneField(User, on_delete=models.CASCADE, related_name='student_profile', null=True) # Janez Novak -> janez_novak_1
	class_ref = models.ForeignKey(Class, on_delete=models.CASCADE, related_name='students') # Из какого класса
	status = models.BooleanField(default=True) # ДЦП, шпортник, уметник, *президент....
	money = models.IntegerField(default=0) # счет
	justice_coefficient = models.FloatField(default=1.0) # коэф. справедливости
	is_active = models.BooleanField(default=True) # для удаления

	def is_president(self):
		return self == self.class_ref.president

	def __str__(self):
		return self.user_ref.username

