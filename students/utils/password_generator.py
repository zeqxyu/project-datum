# Генерирует временный пароль

import random
import string

def generate_password(length=8):
    chars = string.ascii_letters + string.digits  # a-zA-Z0-9
    password = ''.join(random.choice(chars) for _ in range(length))
    return password