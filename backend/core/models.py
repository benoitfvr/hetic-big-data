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
    network = models.ForeignKey(
        "Network", on_delete=models.CASCADE, related_name="stations"
    )
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


class TrafficEvent(models.Model):
    start_time = models.DateTimeField()
    end_time = models.DateTimeField(blank=True, null=True)
    type = models.CharField(max_length=255)
    subtype = models.CharField(max_length=255, blank=True, null=True)
    street = models.CharField(max_length=255)
    description = models.TextField()
    lat1 = models.FloatField()
    lon1 = models.FloatField()
    lat2 = models.FloatField()
    lon2 = models.FloatField()
    direction = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.street} - {self.type}"


class Penalty(models.Model):
    penalty_type = models.CharField(max_length=255)
    penalty_category = models.CharField(max_length=255)
    borough = models.CharField(max_length=255)
    neighborhood_council = models.CharField(max_length=255)
    period = models.CharField(max_length=255)
    penalty_number = models.IntegerField()
    year = models.CharField(max_length=255)
    quarter = models.IntegerField()

    def __str__(self):
        return f"{self.penalty_type} - {self.penalty_number} ({self.year})"
