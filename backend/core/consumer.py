# your_app/consumers.py
import json
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync

class DataConsumer(WebsocketConsumer):
    def connect(self):
        self.group_name = 'data_group'
        
        # Join the group
        async_to_sync(self.channel_layer.group_add)(
            self.group_name,
            self.channel_name
        )
        self.accept()

    def disconnect(self, close_code):
        # Leave the group
        async_to_sync(self.channel_layer.group_discard)(
            self.group_name,
            self.channel_name
        )

    def receive(self, text_data):
        # Handle received data
        data = json.loads(text_data)
        
        # Broadcast to group
        async_to_sync(self.channel_layer.group_send)(
            self.group_name,
            {
                'type': 'send_data',
                'data': data
            }
        )

    def send_data(self, event):
        # Send data to WebSocket
        self.send(text_data=json.dumps(event['data']))