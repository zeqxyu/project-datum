from django.contrib import admin

from .models import Datum, Assessment, DatumDiscount, Swap

# Register your models here.

admin.site.register(Datum)
admin.site.register(Assessment)

admin.site.register(DatumDiscount)
admin.site.register(Swap)