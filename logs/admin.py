from django.contrib import admin

from .models import TransactionLog, RatingLog, DatumLog, JusticeCoefficientLog, PenaltyLog, AssessmentLog, SwapLog
# Register your models here.

admin.site.register(TransactionLog)
admin.site.register(RatingLog)
admin.site.register(DatumLog)
admin.site.register(JusticeCoefficientLog)
admin.site.register(PenaltyLog)
admin.site.register(AssessmentLog)
admin.site.register(SwapLog)