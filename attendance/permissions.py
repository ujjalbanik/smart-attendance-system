from rest_framework.permissions import BasePermission


class IsAdminUserRole(BasePermission):
    def has_permission(self, request, view):
        return hasattr(request.user, 'profile') and request.user.profile.role == 'ADMIN'


class IsActiveDevice(BasePermission):
    def has_permission(self, request, view):
        return hasattr(request.user, "is_active") and request.user.is_active
