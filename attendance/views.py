from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated
import numpy as np

from .models import Attendance, Student
from attendance.permissions import IsActiveDevice, IsAdminUserRole
from .serializers import AttendanceSerializer, StudentSerializer
from devices.authentication import DeviceAuthentication
from devices.models import Device
from django.contrib.auth.models import User


def face_distance(a, b):
    a = np.array(a)
    b = np.array(b)

    if len(a) != len(b):
        return 999  # skip invalid embeddings

    return np.linalg.norm(a - b)


class MarkAttendanceAPIView(APIView):
    permission_classes = []

    def post(self, request):
        face_embedding = request.data.get("face_embedding")

        if not face_embedding:
            return Response(
                {"error": "face_embedding is required"},
                status=400
            )

        # 1️⃣ Find matching student
        students = Student.objects.all()
        matched_student = None
        min_distance = 0.6  # threshold for face recognition

        for student in students:
            if student.face_embedding:
                distance = face_distance(face_embedding, student.face_embedding)
                if distance < min_distance:
                    min_distance = distance
                    matched_student = student
                    break

        if not matched_student:
            return Response(
                {"error": "No matching face found"},
                status=404
            )

        today = timezone.now().date()

        # Get or create attendance record for today
        attendance, created = Attendance.objects.get_or_create(
            student=matched_student,
            date=today,
            defaults={"status": "IN"}
        )

        # 2️⃣ LOGIN
        if attendance.login_time is None:
            attendance.login_time = timezone.now()
            attendance.status = "IN"
            attendance.save()
            return Response(
                {"message": "Attendance checked IN", "status": "IN"},
                status=200
            )

        # 3️⃣ LOGOUT
        if attendance.logout_time is None:
            attendance.logout_time = timezone.now()
            attendance.status = "OUT"
            attendance.save()
            return Response(
                {"message": "Attendance checked OUT", "status": "OUT"},
                status=200
            )

        # 4️⃣ Already completed
        return Response(
            {"message": "Attendance already completed for today"},
            status=400
        )


class MyAttendanceAPIView(ListAPIView):
    serializer_class = AttendanceSerializer
    permission_classes = []

    def get_queryset(self):
        return Attendance.objects.filter(student__user=self.request.user)


class RegisterStudentAPIView(APIView):
    permission_classes = []

    def post(self, request):
        serializer = StudentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


class AllAttendanceAPIView(ListAPIView):
    serializer_class = AttendanceSerializer
    permission_classes = []

    def get_queryset(self):
        return Attendance.objects.all()
