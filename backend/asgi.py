import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from channels.security import AllowedHostsOriginValidator
from todos.routing import websocket_urlpatterns

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

django_asgi_app = get_asgi_application()

application = ProtocolTypeRouter({
    "websocket": AllowedHostsOriginValidator(
        os.getenv('ALLOWED_HOSTS', 'localhost:3000,127.0.0.1:3000'),
        AuthMiddlewareStack(
            URLRouter(websocket_urlpatterns)
        )
    ),
    "http": django_asgi_app,
})

