from .serializers import *
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import viewsets, filters


class CardViewSet(viewsets.ModelViewSet):
    serializer_class = CardSerializer
    permission_classes = [AllowAny]
    #queryset = Card.objects.all()

    search_fields = ['title']
    filter_backends = [filters.SearchFilter]

    def get_queryset(self):
        st = 'ON SALE'
        return Card.objects.all().filter(status=st)

class AuthCardViewSet(viewsets.ModelViewSet):
    serializer_class = CardSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        print("auth user:", user)
        return Card.objects.all().filter(owner=user)
