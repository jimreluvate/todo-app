from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

def api_root(request):
    return JsonResponse({
        'message': 'Todo App Backend API',
        'version': '1.0.0',
        'endpoints': {
            'health': '/api/health/',
            'todos': '/api/todos/',
            'users': '/api/users/',
            'auth': '/auth/',
            'admin': '/admin/'
        }
    })

urlpatterns = [
    path('', api_root, name='api_root'),
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    path('api/todos/', include('todos.urls')),
    path('api/users/', include('users.urls')),
    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.jwt')),
    path('auth/', include('social_django.urls')),
]