from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Network, Station
from .serializers import NetworkSerializer
from django.db.models import Q

class NetworkListView(APIView):
    """
    View pour lister les réseaux disponibles.
    """
    def get(self, request):
        networks = Network.objects.all()
        serializer = NetworkSerializer(networks, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class StationView(APIView):
    """
    View pour lister les stations (toutes ou filtrées selon les critères).
    """

    def get(self, request):
        network_id = request.GET.get("network_id", None) 
        free_bikes = request.GET.get("free_bikes", None) 
        location = request.GET.get("location", None)      
        ebikes = request.GET.get("ebikes", None)       

        filters = Q()
        if network_id:
            filters &= Q(network__external_id=network_id) 
        if free_bikes:
            filters &= Q(free_bikes__gt=0) 
        if location:
            filters &= Q(network__city__icontains=location) 
        if ebikes:
            filters &= Q(ebikes__gt=0) 

        stations = Station.objects.filter(filters)

        station_data = [
            {
                "name": station.name,
                "free_bikes": station.free_bikes,
                "empty_slots": station.empty_slots,
                "ebikes": station.ebikes,
                "latitude": station.latitude,
                "longitude": station.longitude,
                "address": station.address,
                "network": station.network.name,
            }
            for station in stations
        ]

        return Response({"stations": station_data}, status=status.HTTP_200_OK)
    
    
class CityListView(APIView):
    """
    View pour lister toutes les villes où des stations sont présentes.
    """

    def get(self, request):
        cities = Network.objects.values_list("city", flat=True).distinct()

        cities = [city for city in cities if city]

        return Response({"cities": cities}, status=status.HTTP_200_OK)
