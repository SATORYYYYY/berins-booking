from django.db import models

class RestaurantTable(models.Model):
    number = models.IntegerField(unique=True, verbose_name="Номер столика")
    capacity = models.IntegerField(verbose_name="Вместимость")
    description = models.TextField(blank=True, verbose_name="Описание")
    pos_x = models.IntegerField(default=0)
    pos_y = models.IntegerField(default=0)

    def __str__(self):
        return f"Столик №{self.number} ({self.capacity} чел.)"

class Booking(models.Model):
    table = models.ForeignKey(RestaurantTable, on_delete=models.CASCADE, related_name='bookings', verbose_name="Столик")
    date = models.DateField(verbose_name="Дата брони")
    time_start = models.TimeField(verbose_name="Время начала")
    time_end = models.TimeField(verbose_name="Время окончания")
    customer_name = models.CharField(max_length=100, verbose_name="Имя клиента")
    customer_phone = models.CharField(max_length=20, verbose_name="Телефон")
    customer_email = models.EmailField(verbose_name="Email")

    def __str__(self):
        return f"Бронь {self.customer_name} на {self.date} {self.time_start}"
# Create your models here.
