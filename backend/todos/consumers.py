import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from channels.layers import get_channel_layer
from asgiref.sync import sync_to_async

class TodoConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()
        
    async def disconnect(self, close_code):
        pass
    
    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            # Broadcast to all connected clients
            channel_layer = get_channel_layer()
            await channel_layer.group_send(
                'todos',
                {
                    'type': data['type'],
                    'data': data.get('data'),
                    'user_id': data.get('user_id')
                }
            )
        except json.JSONDecodeError:
            pass
    
    async def todo_created(self, event):
        await self.send(text_data=json.dumps({
            'type': 'todo_created',
            'data': event
        }))
    
    async def todo_updated(self, event):
        await self.send(text_data=json.dumps({
            'type': 'todo_updated', 
            'data': event
        }))
    
    async def todo_deleted(self, event):
        await self.send(text_data=json.dumps({
            'type': 'todo_deleted',
            'data': event
        }))
