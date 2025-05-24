
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from . import views

@api_view(['GET'])
@permission_classes([AllowAny])
def api_root(request):
    """API root endpoint providing information about available endpoints"""
    return Response({
        'message': 'ClearPass API',
        'version': '1.0',
        'endpoints': {
            'users': '/api/users/',
            'departments': '/api/departments/',
            'clearance-requests': '/api/clearance-requests/',
            'auth': {
                'login': '/api/auth/login/',
                'logout': '/api/auth/logout/',
            }
        }
    })

router = DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'departments', views.DepartmentViewSet)
router.register(r'clearance-requests', views.ClearanceRequestViewSet, basename='clearance-request')

urlpatterns = [
    path('', api_root, name='api-root'),
    path('', include(router.urls)),
    path('auth/login/', views.login_view, name='login'),
    path('auth/logout/', views.logout_view, name='logout'),
]
