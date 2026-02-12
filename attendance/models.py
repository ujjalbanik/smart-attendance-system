from django.db import models
from django.contrib.auth.models import User
from devices.models import Device

class Student(models.Model):
    name = models.CharField(max_length=100)
    roll_no = models.CharField(max_length=50, unique=True)
    course = models.CharField(max_length=100)
    batch = models.CharField(max_length=50)
    face_embedding = models.JSONField()  # array from face-api

    def __str__(self):
        return f"{self.name} ({self.roll_no})"

class Attendance(models.Model):
    STATUS_CHOICES = (("IN", "Checked In"), ("OUT", "Checked Out"))
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    student = models.ForeignKey(Student, on_delete=models.CASCADE, null=True, blank=True)
    device = models.ForeignKey(Device, on_delete=models.CASCADE)
    date = models.DateField(auto_now_add=True)
    login_time = models.DateTimeField(null=True, blank=True)
    logout_time = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=3, choices=STATUS_CHOICES, null=True, blank=True)
    face_verified = models.BooleanField(default=False)

    class Meta:
        unique_together = (('student', 'date'), ('user', 'date'))
        indexes = [
            models.Index(fields=['date', 'status']),
            models.Index(fields=['student', 'date']),
        ]

    def __str__(self):
        obj_name = self.user.username if self.user else self.student.roll_no
        return f"{obj_name} - {self.date}"
    
