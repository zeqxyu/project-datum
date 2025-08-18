# Генерирует 1.A в 1а24 (год первого семестра)

from datetime import datetime

def generate_class_code(class_name: str, date: datetime = None) -> str:
	if date is None:
		date = datetime.now()

	# Берём год и месяц
	year = date.year
	month = date.month

	# Если месяц >= 9 (сентябрь и далее), считаем год семестра текущим годом
	# Иначе (январь-февраль и т.п.) - год семестра предыдущего года
	if month >= 9:
		semester_year = year
	else:
		semester_year = year - 1

	# Извлекаем цифру и букву из имени класса
	# Ожидается формат "1.A"
	parts = class_name.split('.')
	if len(parts) != 2:
		raise ValueError("Invalid class_name format. Expected format '1.A'")

	number_part = parts[0]
	letter_part = parts[1].lower()

	year_part = str(semester_year)[2:]  # последние две цифры года

	return f"{number_part}{letter_part}{year_part}"
