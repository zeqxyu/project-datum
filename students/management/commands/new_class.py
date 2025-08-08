# эта комманда создает пустой класс

from django.core.management.base import BaseCommand

from django.contrib.auth.models import User
from django.contrib.auth import get_user_model

from students.models import Class, Student  # Импортируй из своего приложения

# Мои утилиты

from utils.cmdout import success, warning, error

from students.utils.username_generator import generate_username, simplify_name
from students.utils.password_generator import generate_password
from students.utils.class_code_generator import generate_class_code

from students.utils.validators.class_name_validator import validate_class_name

from students.utils.constants import start_money, start_justice_coefficient



def create_class(class_name:str):
	class_code = generate_class_code(class_name)

	if Class.objects.filter(code=class_code).exists():
		error(f"❌ Класс с кодом '{class_code}' уже существует.")
		return  # или raise CommandError("...")

	new_class = Class.objects.create(
		code=class_code,
		name=class_name,
		is_active=True,
		president=None
	)

	success(
		f"Класс {class_code} с именем {class_name} создан."
	)


class Command(BaseCommand):
	help = "Создаёт пустой класс."
	
	def handle(self, *args, **options):
		
		while True:
			class_name = input("Введите название класса (пример: 1.A): ").strip()
			if validate_class_name(class_name):
				create_class(class_name)
				break
			else:
				error("❌ Неверный формат. Введите в виде 1.A, 2.B, 3.C и т.д.")

	pass