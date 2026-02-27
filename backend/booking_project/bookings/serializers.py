from rest_framework import serializers
from .models import RestaurantTable, Booking

class RestaurantTableSerializer(serializers.ModelSerializer):
    class Meta:
        model = RestaurantTable
        fields = '__all__'

class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = '__all__'

class BookingCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = '__all__'

    def validate(self, data):
        table = data['table']
        date = data['date']
        time_start = data['time_start']
        time_end = data['time_end']

        if Booking.objects.filter(
            table=table,
            date=date,
            time_start__lt=time_end,
            time_end__gt=time_start
        ).exists():
            raise serializers.ValidationError("Столик уже забронирован на это время.")
        return data