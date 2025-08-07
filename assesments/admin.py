from django.contrib import admin

from .models import Datum, Assesment, DatumDiscount, Swap

# Register your models here.

admin.site.register(Datum)
admin.site.register(Assesment)

admin.site.register(DatumDiscount)
admin.site.register(Swap)