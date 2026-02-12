from django.urls import path

from .views import MarkAttendanceAPIView, MyAttendanceAPIView, RegisterStudentAPIView, AllAttendanceAPIView

urlpatterns = [
    path("admin/all/", AllAttendanceAPIView.as_view()),
    path("register-student/", RegisterStudentAPIView.as_view()),
    path("my/", MyAttendanceAPIView.as_view()),
    path("mark-attendance/", MarkAttendanceAPIView.as_view()),
]
