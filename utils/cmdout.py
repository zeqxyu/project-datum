# Для красивого выведения в консоль

from django.core.management.base import BaseCommand

cmd = BaseCommand()
def success(text):
	cmd.stdout.write(cmd.style.SUCCESS(text))
def warning(text):
	cmd.stdout.write(cmd.style.WARNING(text))
def error(text):
	cmd.stdout.write(cmd.style.ERROR(text))
