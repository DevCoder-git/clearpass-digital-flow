
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import RedirectView
from django.http import HttpResponse

def favicon_view(request):
    """Simple favicon handler to prevent 404 errors"""
    return HttpResponse(status=204)  # No Content response

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('clearpass.urls')),
    path('favicon.ico', favicon_view, name='favicon'),
    path('', RedirectView.as_view(url='/api/', permanent=False), name='root'),
]

# Serve static files during development
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
