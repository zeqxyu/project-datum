from django.urls import path
from . import views

urlpatterns = [
    # path('', views.test, name='test'),
    # path("api/schedule/", views.schedule_api, name="schedule_api"),
    path('', views.my_calendar, name='my_calendar'),
    path('my-account', views.my_account, name='my_account'),
    path('my-class', views.my_class, name='my_class'),
]
