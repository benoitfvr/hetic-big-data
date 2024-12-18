import os
import django
from asgiref.sync import sync_to_async

# Configuration de Django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

import asyncio
import json
from django.db.models import Q
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import Station


class StationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()
        self.running = True
        self.filters = {}  # Stocke les filtres envoyés par le client
        self.new_filters_event = (
            asyncio.Event()
        )  # Événement pour signaler les nouveaux filtres
        print("WebSocket connecté")
        asyncio.create_task(self.send_stations_periodically())

    async def disconnect(self, close_code):
        self.running = False
        print("WebSocket déconnecté")

    async def receive(self, text_data):
        """
        Reçoit les filtres depuis le client WebSocket à tout moment.
        Exemple de message : {"action": "set_filters", "filters": {"network_id": "123"}}
        """
        data = json.loads(text_data)
        action = data.get("action")

        if action == "set_filters":
            self.filters = data.get("filters", {})
            print("Nouveaux filtres reçus :", self.filters)
            self.new_filters_event.set()  # Déclenche l'événement pour signaler un changement

    async def send_stations_periodically(self):
        """
        Envoie les données des stations périodiquement ou lorsque les filtres changent.
        """
        while self.running:
            # Récupération des stations filtrées
            stations = await sync_to_async(self.get_filtered_stations)()
            station_data = [
                {
                    "name": station.name,
                    "free_bikes": station.free_bikes,
                    "empty_slots": station.empty_slots,
                    "ebikes": station.ebikes,
                    "latitude": station.latitude,
                    "longitude": station.longitude,
                    "address": station.address,
                }
                for station in stations
            ]

            # Envoi des données via WebSocket
            await self.send(
                text_data=json.dumps(
                    {"type": "station_update", "stations": station_data}
                )
            )

            # Attendre 20 secondes ou une mise à jour des filtres
            try:
                await asyncio.wait_for(self.new_filters_event.wait(), timeout=20)
            except asyncio.TimeoutError:
                # Timeout expiré sans nouvel événement, la boucle continue normalement
                pass

            self.new_filters_event.clear()  # Réinitialise l'état de l'événement

    def get_filtered_stations(self):
        """
        Applique les filtres dynamiques aux stations en utilisant Q().
        """
        filters = Q()
        network_id = self.filters.get("network_id", None)
        free_bikes = self.filters.get("free_bikes", None)
        location = self.filters.get("location", None)
        ebikes = self.filters.get("ebikes", None)

        # Construction des filtres
        if network_id:
            filters &= Q(network__external_id=network_id)
        if (
            free_bikes
            and free_bikes != 0
            and free_bikes is not None
            and free_bikes != "0"
        ):
            filters &= Q(free_bikes__gt=0)
        if location:
            filters &= Q(network__city__icontains=location)
        if ebikes and ebikes != 0 and ebikes is not None and ebikes != "0":
            filters &= Q(ebikes__gt=0)

        return list(Station.objects.filter(filters))
