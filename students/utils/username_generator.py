# генерирует юзернейм из имени и фамилии

from django.contrib.auth.models import User
from django.contrib.auth import get_user_model

import re

# генерация имени пользователя из имени и фамилии

def simplify_name(text: str) -> str:
	text = text.lower()
	text = text.replace("š", "s").replace("č", "c").replace("ž", "z").replace("ć", "c")
	text = re.sub(r"[^a-z]", "", text)  # Удаляем всё, кроме латинских букв
	return text

def generate_username(first_name: str, last_name: str) -> str:
	# Разделение по дефису и обрезка до 3 букв
	base_first = simplify_name(first_name.split("-")[0])[:3]
	base_last = simplify_name(last_name.split("-")[0])[:3]

	base = f"{base_first}{base_last}"

	# Проверка уникальности
	num = 1
	username = f"{base}{num}"
	while User.objects.filter(username=username).exists():
		num += 1
		username = f"{base}{num}"

	return username
