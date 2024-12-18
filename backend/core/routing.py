from django.urls import re_path
from core.consumers import StationConsumer

websocket_urlpatterns = [
    re_path(r"^ws/stations/$", StationConsumer.as_asgi()),  # Vérifiez l'URL exacte
]
