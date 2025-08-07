import re

# если формат класса неправильный, то попытка повторяется
def validate_class_name(class_name: str) -> bool:
	# Регулярное выражение для проверки формата
	pattern = r"^[1-4]\.[A-D]$"
	return bool(re.match(pattern, class_name))
