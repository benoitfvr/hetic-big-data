from django.urls import path
from .views import NetworkListView, StationListView, FilteredStationListView, CityListView

urlpatterns = [
    path('networks/', NetworkListView.as_view(), name='list_networks'),
    path('networks/<str:network_id>/', StationListView.as_view(), name='list_stations'),
    path('stations/filtered/', FilteredStationListView.as_view(), name='filtered_stations'),
    path('cities/', CityListView.as_view(), name='list_cities'),
]
