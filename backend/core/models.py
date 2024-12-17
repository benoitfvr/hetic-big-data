from django.db import models

class Network(models.Model):
    external_id = models.CharField(max_length=255, unique=True)
    name = models.CharField(max_length=255)
    company = models.CharField(max_length=255, blank=True, null=True)
    city = models.CharField(max_length=255)
    country = models.CharField(max_length=10)
    latitude = models.FloatField()
    longitude = models.FloatField()

    def __str__(self):
        return self.name


class Station(models.Model):
    network = models.ForeignKey('Network', on_delete=models.CASCADE, related_name='stations')
    external_id = models.CharField(max_length=255, unique=True)
    name = models.CharField(max_length=255)
    free_bikes = models.IntegerField(default=0)
    empty_slots = models.IntegerField(default=0)
    ebikes = models.IntegerField(default=0)
    address = models.CharField(max_length=255, blank=True, null=True)
    latitude = models.FloatField(blank=True, null=True)   
    longitude = models.FloatField(blank=True, null=True)

    def __str__(self):
        return f"{self.name} - {self.network.name}"

