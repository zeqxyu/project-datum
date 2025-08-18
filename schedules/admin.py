from django.contrib import admin

from .models import Subject, Schedule, ScheduleSlot

# Register your models here.

admin.site.register(Subject)
admin.site.register(Schedule)
admin.site.register(ScheduleSlot)