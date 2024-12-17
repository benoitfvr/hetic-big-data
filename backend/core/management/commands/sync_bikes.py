from django.core.management.base import BaseCommand
import requests
from core.models import Network, Station

class Command(BaseCommand):
    help = "Synchronise les données des réseaux et stations de vélos situés en France."

    def handle(self, *args, **options):
        try:
            # Étape 1 : Récupérer tous les réseaux
            networks_url = "https://api.citybik.es/v2/networks"
            response = requests.get(networks_url)
            print(response)
            networks_data = response.json()

            if "networks" not in networks_data:
                self.stdout.write(self.style.ERROR("Pas de réseaux trouvés dans l'API."))
                return

            # Filtrer les réseaux en France (location.country == 'FR')
            french_networks = [
                network for network in networks_data["networks"]
                if network.get("location", {}).get("country") == "FR"
            ]

            self.stdout.write(self.style.SUCCESS(f"Nombre de réseaux en France trouvés : {len(french_networks)}"))

            # Étape 2 : Synchroniser les réseaux français et leurs stations
            for i, network_info in enumerate(french_networks, start=1):
                network_id = network_info["id"]
                self.stdout.write(self.style.NOTICE(f"Synchronisation du réseau {i}/{len(french_networks)} : {network_info['name']}"))

                try:
                    # Appel API pour les détails du réseau (stations incluses)
                    url = f"https://api.citybik.es/v2/networks/{network_id}"
                    response = requests.get(url)
                    data = response.json()

                    if "network" not in data:
                        continue

                    # Synchroniser les informations du réseau
                    network_data = data["network"]
                    network, _ = Network.objects.update_or_create(
                        external_id=network_data["id"],
                        defaults={
                            "name": network_data["name"],
                            "company": ", ".join(network_data.get("company", [])),
                            "city": network_data["location"]["city"],
                            "country": network_data["location"]["country"],
                            "latitude": network_data["location"]["latitude"],
                            "longitude": network_data["location"]["longitude"],
                        },
                    )

                    # Synchroniser les stations associées
                    for station in network_data.get("stations", []):
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

                    self.stdout.write(self.style.SUCCESS(f"Réseau synchronisé : {network_data['name']}"))

                except Exception as network_error:
                    self.stdout.write(self.style.ERROR(f"Erreur pour le réseau {network_id} : {network_error}"))

            self.stdout.write(self.style.SUCCESS("Synchronisation des réseaux français terminée."))

        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Erreur globale : {str(e)}"))
