from django.urls import path
from . import views

urlpatterns = [
    # path('', views.test, name='test'),
    # path("api/schedule/", views.schedule_api, name="schedule_api"),
    
    # STUDENTS
    path('my-account', views.my_account, name='my_account'),
    path('my-class', views.my_class, name='my_class'),
    
    # ASSESSMENTS
    path('', views.my_calendar, name='my_calendar'),
    path('assessments/1a24', views.assessment_view, name='assessment'),
    path('assessments', views.assessments, name='assessments'),
]
