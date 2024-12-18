from django.urls import path
from .views import NetworkListView, StationView, CityListView,watch_view

urlpatterns = [
    path('networks/', NetworkListView.as_view(), name='list_networks'),
    path('stations/', StationView.as_view(), name='stations'),
    path('cities/', CityListView.as_view(), name='list_cities'),
    path('watch/', watch_view, name='watch'),

]
