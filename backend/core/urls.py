from django.urls import path
from .views import NetworkListView, StationView, CityListView

urlpatterns = [
    path('networks/', NetworkListView.as_view(), name='list_networks'),
    path('stations/', StationView.as_view(), name='stations'),
    path('cities/', CityListView.as_view(), name='list_cities'),
]
