
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'departments', views.DepartmentViewSet)
router.register(r'clearance-requests', views.ClearanceRequestViewSet, basename='clearance-request')

urlpatterns = [
    path('', include(router.urls)),
    path('auth/login/', views.login_view, name='login'),
    path('auth/logout/', views.logout_view, name='logout'),
]
