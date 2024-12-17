from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Network, Station
from .serializers import NetworkSerializer

class NetworkListView(APIView):
    """
    View pour lister les réseaux disponibles.
    """
    def get(self, request):
        networks = Network.objects.all()
        serializer = NetworkSerializer(networks, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class StationListView(APIView):
    """
    View pour lister les stations d'un réseau donné.
    """
    def get(self, request, network_id):
        try:
            network = Network.objects.get(external_id=network_id)
            stations = Station.objects.filter(network=network)
            station_data = [{
                "name": station.name,
                "free_bikes": station.free_bikes,
                "empty_slots": station.empty_slots,
                "ebikes": station.ebikes,
                "latitude": station.latitude,
                "longitude": station.longitude,
                "address": station.address
            } for station in stations]

            return Response({
                "network": network.name,
                "stations": station_data
            }, status=status.HTTP_200_OK)

        except Network.DoesNotExist:
            return Response({"error": "Network not found"}, status=status.HTTP_404_NOT_FOUND)
