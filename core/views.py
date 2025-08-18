from django.shortcuts import render

from django.http import JsonResponse
from schedules.models import Schedule  # или твоя модель
from students.models import Class
from schedules.utils.schedule_to_dict import schedule_to_dict  # например, если есть утилита

# Create your views here.
# def test(request):
#     return render(request, 'core/test.html')


# def schedule_api(request):
#     # Если есть функция, которая возвращает dict расписания:
#     data = schedule_to_dict(
#         Schedule.objects.filter(class_ref=Class.objects.get(code='1a24')).last()
#     )
#     return JsonResponse(data, safe=False)  # safe=False, если data — список

# STUDENTS


def my_account(request):
    return render(request, 'students/my_account.html')

def my_class(request):
    return render(request, 'students/my_class.html')


# ASSESSMENTS

def my_calendar(request):
    return render(request, 'assessments/calendar.html')

def assessment_view(request):
    return render(request, 'assessments/calendar.html')

def assessments(request):
    return render(request, 'assessments/assessments.html')