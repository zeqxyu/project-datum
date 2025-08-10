from django.urls import path
from . import views

urlpatterns = [
    # path('', views.test, name='test'),
    # path("api/schedule/", views.schedule_api, name="schedule_api"),
    path('', views.my_calendar, name='my_calendar'),
]
