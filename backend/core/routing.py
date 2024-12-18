from django.urls import re_path
from core.consumers import StationConsumer,TimeConsumer

websocket_urlpatterns = [
    re_path(r"^ws/stations/$", StationConsumer.as_asgi()),
    re_path(r'ws/watch/$', TimeConsumer.as_asgi()),

]
