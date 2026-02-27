from django.contrib import admin
from .models import RestaurantTable, Booking

@admin.register(RestaurantTable)
class RestaurantTableAdmin(admin.ModelAdmin):
    list_display = ('number', 'capacity', 'description')
    list_editable = ('capacity',)

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('table', 'date', 'time_start', 'time_end', 'customer_name')
    list_filter = ('date', 'table')
# Register your models here.
