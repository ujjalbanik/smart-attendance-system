from django.db import models
import uuid

class Device(models.Model):
    name = models.CharField(max_length=100)
    device_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    is_active = models.BooleanField(default=True)
    registered_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.device_id}"