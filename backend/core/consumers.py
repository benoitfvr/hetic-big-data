import json
from channels.generic.websocket import AsyncWebsocketConsumer

class StationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.channel_layer.group_add("stations", self.channel_name)
        await self.accept()
        print("WebSocket connecté")

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard("stations", self.channel_name)
        print("WebSocket déconnecté")

    async def send_station_update(self, event):
        message = event["message"]
        await self.send(text_data=json.dumps(message))

