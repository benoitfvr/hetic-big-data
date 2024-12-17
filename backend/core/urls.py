from django.urls import path
from .views import NetworkListView, StationListView

urlpatterns = [
    path('networks/', NetworkListView.as_view(), name='list_networks'),
    path('stations/<str:network_id>/', StationListView.as_view(), name='list_stations'),
]
