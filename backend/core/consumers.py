import asyncio
import json
from datetime import datetime
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


class TimeConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()
        self.running = True
        asyncio.create_task(self.send_time())

    async def disconnect(self, close_code):
        self.running = False

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json.get('message', '')
        
        if message == 'get_time':
            await self.send_current_time()

    async def send_time(self):
        while self.running:
            await self.send_current_time()
            await asyncio.sleep(1)  # Update every second

    async def send_current_time(self):
        current_time = datetime.now().strftime('%H:%M:%S')
        await self.send(text_data=json.dumps({
            'type': 'time_update',
            'time': current_time
        }))