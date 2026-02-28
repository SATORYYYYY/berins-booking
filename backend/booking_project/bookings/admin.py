from django.contrib import admin
from .models import Restaurant, RestaurantTable, Booking

@admin.register(Restaurant)
class RestaurantAdmin(admin.ModelAdmin):
    list_display = ('name', 'address')  
    search_fields = ('name',)

@admin.register(RestaurantTable)
class RestaurantTableAdmin(admin.ModelAdmin):
    list_display = ('restaurant', 'number', 'capacity')
    list_filter = ('restaurant',)
    list_editable = ('capacity',)

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('table', 'date', 'time_start', 'time_end', 'customer_name')
    list_filter = ('date', 'table__restaurant')
# Register your models here.
