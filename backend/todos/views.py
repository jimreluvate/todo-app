from rest_framework import generics, permissions
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from .models import Todo
from .serializers import TodoSerializer

@method_decorator(csrf_exempt, name='dispatch')
class TodoListCreateView(generics.ListCreateAPIView):
    serializer_class = TodoSerializer
    permission_classes = []  # Temporarily disable auth for testing

    def get_queryset(self):
        return Todo.objects.filter(user=self.request.user) if self.request.user.is_authenticated else Todo.objects.all()

    def perform_create(self, serializer):
        if self.request.user.is_authenticated:
            serializer.save(user=self.request.user)
        else:
            # For testing, create without user
            serializer.save()

@method_decorator(csrf_exempt, name='dispatch')
class TodoRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TodoSerializer
    permission_classes = []  # Temporarily disable auth for testing

    def get_queryset(self):
        return Todo.objects.filter(user=self.request.user) if self.request.user.is_authenticated else Todo.objects.all()
