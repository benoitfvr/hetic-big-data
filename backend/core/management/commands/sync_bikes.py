from django.core.management.base import BaseCommand
import requests
from core.models import Network, Station
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

class Command(BaseCommand):
    help = "Synchronise les données des réseaux et stations de vélos situés en France."

    def handle(self, *args, **options):
        try:
            networks_url = "https://api.citybik.es/v2/networks"
            response = requests.get(networks_url)
            networks_data = response.json()

            if "networks" not in networks_data:
                self.stdout.write(self.style.ERROR("Pas de réseaux trouvés dans l'API."))
                return

            french_networks = [
                network for network in networks_data["networks"]
                if network.get("location", {}).get("country") == "FR"
            ]

            self.stdout.write(self.style.SUCCESS(f"Nombre de réseaux en France trouvés : {len(french_networks)}"))

            for network_info in french_networks:
                try:
                    network, _ = Network.objects.update_or_create(
                        external_id=network_info["id"],
                        defaults={
                            "name": network_info["name"],
                            "company": ", ".join(network_info.get("company", [])),
                            "city": network_info["location"]["city"],
                            "country": network_info["location"]["country"],
                            "latitude": network_info["location"]["latitude"],
                            "longitude": network_info["location"]["longitude"],
                        },
                    )

                    for station in network_info.get("stations", []):
                        Station.objects.update_or_create(
                            external_id=station["id"],
                            network=network,
                            defaults={
                                "name": station["name"],
                                "free_bikes": station.get("free_bikes", 0),
                                "empty_slots": station.get("empty_slots", 0),
                                "ebikes": station.get("extra", {}).get("ebikes", 0),
                                "address": station.get("extra", {}).get("address", ""),
                                "latitude": station.get("latitude", None),
                                "longitude": station.get("longitude", None),
                            },
                        )

                    self.stdout.write(self.style.SUCCESS(f"Réseau synchronisé : {network_info['name']}"))

                except Exception as network_error:
                    self.stdout.write(self.style.ERROR(f"Erreur pour le réseau {network_info['id']} : {network_error}"))

            stations = Station.objects.all()
            station_data = [
                {
                    "name": station.name,
                    "free_bikes": station.free_bikes,
                    "empty_slots": station.empty_slots,
                    "ebikes": station.ebikes,
                    "latitude": station.latitude,
                    "longitude": station.longitude,
                    "address": station.address,
                    "network": station.network.name,
                }
                for station in stations
            ]

            channel_layer = get_channel_layer()
            async_to_sync(channel_layer.group_send)(
                "stations",
                {
                    "type": "send_station_update",
                    "message": {"stations": station_data},
                }
            )

            self.stdout.write(self.style.SUCCESS("Synchronisation des réseaux français terminée et mise à jour envoyée."))

        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Erreur globale : {str(e)}"))
