from rest_framework import serializers
from .models import Network, Station


class StationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Station
        fields = [
            "id",
            "external_id",
            "name",
            "free_bikes",
            "empty_slots",
            "ebikes",
            "address",
            "latitude",
            "longitude",
        ]


class NetworkSerializer(serializers.ModelSerializer):
    stations = StationSerializer(many=True, read_only=True)

    class Meta:
        model = Network
        fields = [
            "id",
            "external_id",
            "name",
            "company",
            "city",
            "country",
            "latitude",
            "longitude",
            "stations",
        ]
