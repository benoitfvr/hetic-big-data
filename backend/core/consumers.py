import asyncio
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import Station

class StationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()
        self.running = True
        print("WebSocket connecté")
        asyncio.create_task(self.send_stations_periodically())

    async def disconnect(self, close_code):
        self.running = False
        print("WebSocket déconnecté")

    async def send_stations_periodically(self):
        while self.running:
            # Récupération des données des stations
            stations = Station.objects.all()
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

            # Envoi des données via WebSocket
            await self.send(text_data=json.dumps({
                "type": "station_update",
                "stations": station_data
            }))

            # Attente de 5 secondes avant la prochaine mise à jour
            await asyncio.sleep(5)
