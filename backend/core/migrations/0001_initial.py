import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Network',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('external_id', models.CharField(max_length=255, unique=True)),
                ('name', models.CharField(max_length=255)),
                ('company', models.CharField(blank=True, max_length=255, null=True)),
                ('city', models.CharField(max_length=255)),
                ('country', models.CharField(max_length=10)),
                ('latitude', models.FloatField()),
                ('longitude', models.FloatField()),
            ],
        ),
        migrations.CreateModel(
            name='Station',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('external_id', models.CharField(max_length=255)),
                ('name', models.CharField(max_length=255)),
                ('free_bikes', models.IntegerField(default=0)),
                ('empty_slots', models.IntegerField(default=0)),
                ('ebikes', models.IntegerField(default=0)),
                ('address', models.CharField(blank=True, max_length=255, null=True)),
                ('network', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='stations', to='core.network')),
            ],
        ),
    ]
