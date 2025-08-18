# проверяет валидность кода класса

import re

def validate_class_code(code: str) -> bool:
	"""
	Проверяет, соответствует ли код класса формату:
	цифра 1-4 + буква a-e (lowercase) + две цифры (00-99)
	Примеры: 1a24, 3c05
	"""
	pattern = r"^[1-4][a-e][0-9]{2}$"
	return bool(re.match(pattern, code))