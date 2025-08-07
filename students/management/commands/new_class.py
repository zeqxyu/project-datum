from django.core.management.base import BaseCommand

from django.contrib.auth.models import User
from django.contrib.auth import get_user_model

from students.models import Class, Student  # Импортируй из своего приложения

# Мои утилиты
from students.utils.username_generator import generate_username, simplify_name
from students.utils.name_validator import validate_class_name
from students.utils.password_generator import generate_password
from students.utils.class_code_generator import generate_class_code

from students.utils.constants import start_money, start_justice_coefficient


# класс так называется по требованию джанго
class Command(BaseCommand):
	help = "Создаёт новый класс и президента вручную. Генерирует временный пароль президенту."

	def handle(self, *args, **options):

		# Ввод данных для класса

		while True:
			class_name = input("Введите название класса (пример: 1.A): ").strip()
			if validate_class_name(class_name):
				break
			else:
				print("❌ Неверный формат. Введите в виде 1.A, 2.B, 3.C и т.д.")
		
		class_code = generate_class_code(class_name)

		# Ввод данных для президента

		president_firstname = input("Введите имя президента: ").strip()
		president_lastname = input("Введите фамилию президента: ").strip()
		
		# Генерация username
		username = generate_username(president_firstname, president_lastname)
		if User.objects.filter(username=username).exists():
			self.stdout.write(self.style.ERROR(f"Пользователь {username} уже существует!"))
			return

		print(f"Пользователь {username} создан. Он в классе {class_code}")
		# Генерация пароля
		temp_password = generate_password()

		# Сохранение класса в БД без президента

		new_class = Class.objects.create(
			code=class_code,
			name=class_name,
			is_active=True,
			president=None
		)

		# Создание пользователя-президента
		new_user = User.objects.create_user(
			first_name=president_firstname,
			last_name=president_lastname,
			username=username, 
			password=temp_password
		)

		# Создание профиля студента
		new_president = Student.objects.create(
			user_ref=new_user,
			class_ref=new_class,
			status=True, # так как президент
			money=start_money,
			justice_coefficient=start_justice_coefficient,
			is_active=True
		)

		# Обновление президента класса:

		new_class.president = new_president
		new_class.save()

		self.stdout.write(self.style.SUCCESS(
			f"\nКласс {class_code} с именем {class_name} создан."
		))
		self.stdout.write(self.style.SUCCESS(
			f"\nПрезидент {username} с именем {president_firstname} {president_lastname} создан."
		))
		self.stdout.write(self.style.WARNING(
			f"\nВременный пароль: {temp_password}"
		))

		# # Вывод в консоль
		# self.stdout.write(self.style.SUCCESS("Класс и президент созданы успешно!"))
		# self.stdout.write(f"Username: {username}")
		# self.stdout.write(f"Временный пароль: {temp_password}")

	pass