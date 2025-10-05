from django.shortcuts import render

from django.http import JsonResponse
from schedules.models import Schedule  # или твоя модель
from students.models import Class
from schedules.utils.schedule_to_dict import schedule_to_dict  # например, если есть утилита

from django.contrib.auth.decorators import login_required

from students.models import Student, Class


def error_404(request, exception):
    return render(request, "404.html", status=404)



# STUDENTS

def login(request):
    return render(request, 'students/login.html')

@login_required
def my_account(request):
    return render(request, 'students/my_account.html')

@login_required
def my_class(request):
    return render(request, 'students/my_class.html')


# ASSESSMENTS
@login_required
def my_calendar(request):
    return render(request, 'assessments/calendar.html')

@login_required
def assessment_view(request):
    return render(request, 'assessments/calendar.html')

@login_required
def assessment_table(request):
    return render(request, 'assessments/assessment_table.html')

@login_required
def assessments(request):
    return render(request, 'assessments/assessments.html')


# API


from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def menu_data(request):
    user = request.user  # текущий залогиненный пользователь
    student = Student.objects.get(user_ref=user)
    # пока оставим notifications пустым
    menu_data = {
        "student_data": {
            "firstname": user.first_name,
            "lastname": user.last_name,
            "username": user.username,
            "status": student.status,  # например, активен
            "is_president": student.is_president(),  # кастомное поле в модели Student
            "money": student.money,  # поле из модели Student
            "justice_coefficient": student.justice_coefficient
        },
        "notifications": []
    }

    return Response(menu_data)

