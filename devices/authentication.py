from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from .models import Device

class DeviceAuthentication(BaseAuthentication):
    def authenticate(self, request):
        device_id = request.headers.get('X-DEVICE-ID')

        if not device_id:
            return None

        try:
            device = Device.objects.get(device_id=device_id, is_active=True)
        except Device.DoesNotExist:
            raise AuthenticationFailed("Invalid or inactive device")

        return (device, None)
