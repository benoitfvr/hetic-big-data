from rest_framework import serializers
from .models import Network, Station, TrafficEvent


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
        ]


class TrafficEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrafficEvent
        fields = "__all__"  # Include all fields, or specify which ones you need
