from django.contrib.auth import views as auth_views
from django.urls import path
from . import views

# 404
from django.conf.urls import handler404
handler404 = "core.views.error_404"

urlpatterns = [
    # path('', views.test, name='test'),
    # path("api/schedule/", views.schedule_api, name="schedule_api"),
    
    # ACCOUNTS (STUDENTS)
    path("login/", auth_views.LoginView.as_view(template_name="students/login.html"), name="login"),
    path("logout/", auth_views.LogoutView.as_view(), name="logout"),

    # STUDENTS
    path('my-account', views.my_account, name='my_account'),
    path('my-class', views.my_class, name='my_class'),
    
    # ASSESSMENTS
    path('', views.my_calendar, name='my_calendar'),
    path('assessments/1a24', views.assessment_view, name='assessment'),
    path('assessments/1a24_matust1/table', views.assessment_table, name='assessment_table'),
    path('assessments', views.assessments, name='assessments'),


    # API

    path("api/students/menu_data", views.menu_data, name="menu_data"),
]

