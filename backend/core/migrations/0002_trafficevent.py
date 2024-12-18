# Generated by Django 5.1.4 on 2024-12-19 09:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='TrafficEvent',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('start_time', models.DateTimeField()),
                ('end_time', models.DateTimeField(blank=True, null=True)),
                ('type', models.CharField(max_length=255)),
                ('subtype', models.CharField(blank=True, max_length=255, null=True)),
                ('street', models.CharField(max_length=255)),
                ('description', models.TextField()),
                ('lat1', models.FloatField()),
                ('lon1', models.FloatField()),
                ('lat2', models.FloatField()),
                ('lon2', models.FloatField()),
                ('direction', models.CharField(max_length=100)),
            ],
        ),
    ]
