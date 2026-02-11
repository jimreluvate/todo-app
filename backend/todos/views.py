from rest_framework import generics, permissions
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from channels.layers import get_channel_layer
from asgiref.sync import sync_to_async
from .models import Todo
from .serializers import TodoSerializer

@method_decorator(csrf_exempt, name='dispatch')
class TodoListCreateView(generics.ListCreateAPIView):
    serializer_class = TodoSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Todo.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        if self.request.user.is_authenticated:
            serializer.save(user=self.request.user)
        else:
            # For testing, create without user
            todo = serializer.save()
            
            # Send WebSocket notification
            sync_to_async(self._notify_todo_created)(todo)
            return todo

    @sync_to_async
    def _notify_todo_created(self, todo):
        channel_layer = get_channel_layer()
        channel_layer.group_send(
            'todos',
            {
                'type': 'todo_created',
                'data': {
                    'id': str(todo.id),
                    'title': todo.title,
                    'completed': todo.completed,
                    'created_at': todo.created_at.isoformat(),
                    'updated_at': todo.updated_at.isoformat(),
                }
            }
        )

@method_decorator(csrf_exempt, name='dispatch')
class TodoRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TodoSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Todo.objects.filter(user=self.request.user)

    def update(self, request, *args, **kwargs):
        response = super().update(request, *args, **kwargs)
        if response.status_code == 200:
            todo = self.get_object()
            sync_to_async(self._notify_todo_updated)(todo)
        return response

    def destroy(self, request, *args, **kwargs):
        todo = self.get_object()
        todo_id = str(todo.id)
        response = super().destroy(request, *args, **kwargs)
        if response.status_code == 204:
            sync_to_async(self._notify_todo_deleted)({'id': todo_id})
        return response

    @sync_to_async
    def _notify_todo_updated(self, todo):
        channel_layer = get_channel_layer()
        channel_layer.group_send(
            'todos',
            {
                'type': 'todo_updated',
                'data': {
                    'id': str(todo.id),
                    'title': todo.title,
                    'completed': todo.completed,
                    'created_at': todo.created_at.isoformat(),
                    'updated_at': todo.updated_at.isoformat(),
                }
            }
        )

    @sync_to_async
    def _notify_todo_deleted(self, todo_data):
        channel_layer = get_channel_layer()
        channel_layer.group_send(
            'todos',
            {
                'type': 'todo_deleted',
                'data': todo_data
            }
        )
