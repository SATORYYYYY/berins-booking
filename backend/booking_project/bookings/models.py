from django.db import models

class Restaurant(models.Model):
    name = models.CharField(max_length=100, verbose_name="Название")
    address = models.CharField(max_length=200, verbose_name="Адрес")
    description = models.TextField(blank=True, verbose_name="Описание")
    phone = models.CharField(max_length=20, verbose_name="Телефон")
    email = models.EmailField(verbose_name="Email")
    opening_time = models.TimeField(verbose_name="Время открытия")
    closing_time = models.TimeField(verbose_name="Время закрытия")
    image = models.ImageField(upload_to='restaurants/', blank=True, null=True, verbose_name="Фото ресторана")

    class Meta:
        verbose_name = "Ресторан"
        verbose_name_plural = "Рестораны"

    def __str__(self):
        return self.name

class RestaurantTable(models.Model):
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE, related_name='tables', verbose_name="Ресторан")
    number = models.IntegerField(verbose_name="Номер столика")
    capacity = models.IntegerField(verbose_name="Вместимость")
    description = models.TextField(blank=True, verbose_name="Описание")
    pos_x = models.IntegerField(default=0)
    pos_y = models.IntegerField(default=0)

    class Meta:
        unique_together = ('restaurant', 'number')  
        verbose_name = "Столик"
        verbose_name_plural = "Столики"

    def __str__(self):
        return f"{self.restaurant.name} - столик №{self.number}"

class Booking(models.Model):
    table = models.ForeignKey(RestaurantTable, on_delete=models.CASCADE, related_name='bookings', verbose_name="Столик")
    date = models.DateField(verbose_name="Дата брони")
    time_start = models.TimeField(verbose_name="Время начала")
    time_end = models.TimeField(verbose_name="Время окончания")
    customer_name = models.CharField(max_length=100, verbose_name="Имя клиента")
    customer_phone = models.CharField(max_length=20, verbose_name="Телефон")
    customer_email = models.EmailField(verbose_name="Email")

    class Meta:
        verbose_name = "Бронирование"
        verbose_name_plural = "Бронирования"

    def __str__(self):
        return f"{self.customer_name} - {self.table} на {self.date} {self.time_start}"
# Create your models here.
