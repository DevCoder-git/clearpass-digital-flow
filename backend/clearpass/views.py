
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from django.contrib.auth import authenticate, login, logout
from .models import User, Department, ClearanceRequest
from .serializers import UserSerializer, DepartmentSerializer, ClearanceRequestSerializer

class IsAdminUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == User.ADMIN

class IsDepartmentUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == User.DEPARTMENT

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]

class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.IsAuthenticated()]
        return [IsAdminUser()]

class ClearanceRequestViewSet(viewsets.ModelViewSet):
    serializer_class = ClearanceRequestSerializer
    
    def get_queryset(self):
        user = self.request.user
        if user.role == User.ADMIN:
            return ClearanceRequest.objects.all()
        elif user.role == User.DEPARTMENT:
            return ClearanceRequest.objects.filter(department__head=user)
        else:  # Student
            return ClearanceRequest.objects.filter(student=user)
    
    def create(self, request, *args, **kwargs):
        # Set the student to the current user if role is student
        if request.user.role == User.STUDENT:
            request.data['student'] = request.user.id
            
        return super().create(request, *args, **kwargs)
    
    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        
        # Only department heads can update status
        if request.user.role == User.DEPARTMENT and request.user == instance.department.head:
            return super().update(request, *args, **kwargs)
            
        # Allow admins to update status
        if request.user.role == User.ADMIN:
            return super().update(request, *args, **kwargs)
            
        return Response({"detail": "You don't have permission to update this request."},
                        status=status.HTTP_403_FORBIDDEN)
    
    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        instance = self.get_object()
        
        if request.user.role not in [User.ADMIN, User.DEPARTMENT]:
            return Response({"detail": "Only admins and department heads can approve requests."},
                           status=status.HTTP_403_FORBIDDEN)
                           
        if request.user.role == User.DEPARTMENT and request.user != instance.department.head:
            return Response({"detail": "You can only approve requests for your department."},
                           status=status.HTTP_403_FORBIDDEN)
                           
        instance.status = 'approved'
        instance.save()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        instance = self.get_object()
        reason = request.data.get('reason', '')
        
        if not reason:
            return Response({"detail": "Rejection reason is required."},
                           status=status.HTTP_400_BAD_REQUEST)
        
        if request.user.role not in [User.ADMIN, User.DEPARTMENT]:
            return Response({"detail": "Only admins and department heads can reject requests."},
                           status=status.HTTP_403_FORBIDDEN)
                           
        if request.user.role == User.DEPARTMENT and request.user != instance.department.head:
            return Response({"detail": "You can only reject requests for your department."},
                           status=status.HTTP_403_FORBIDDEN)
                           
        instance.status = 'rejected'
        instance.comment = reason
        instance.save()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def login_view(request):
    username = request.data.get('email', '')
    password = request.data.get('password', '')
    
    user = authenticate(username=username, password=password)
    
    if user is not None:
        login(request, user)
        serializer = UserSerializer(user)
        return Response(serializer.data)
    else:
        return Response({"detail": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def logout_view(request):
    logout(request)
    return Response({"detail": "Successfully logged out."})
