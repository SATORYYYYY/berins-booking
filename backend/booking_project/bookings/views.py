from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import RestaurantTable, Booking
from .serializers import RestaurantTableSerializer, BookingSerializer, BookingCreateSerializer

class RestaurantTableViewSet(viewsets.ModelViewSet):
    queryset = RestaurantTable.objects.all()
    serializer_class = RestaurantTableSerializer

class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer

    def get_serializer_class(self):
        if self.action == 'create':
            return BookingCreateSerializer
        return BookingSerializer

    @action(detail=False, methods=['get'])
    def available_tables(self, request):
        date = request.query_params.get('date')
        time_start = request.query_params.get('time_start')
        time_end = request.query_params.get('time_end')
        return Response([])
# Create your views here.
