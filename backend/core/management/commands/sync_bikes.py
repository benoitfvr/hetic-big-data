from django.core.management.base import BaseCommand
import requests
from core.models import Network, Station

class Command(BaseCommand):
    help = "Synchronise les données de tous les réseaux et stations de vélos disponibles."

    def handle(self, *args, **options):
        try:
            networks_url = "https://api.citybik.es/v2/networks"
            response = requests.get(networks_url)
            networks_data = response.json()

            if "networks" not in networks_data:
                self.stdout.write(self.style.ERROR("Pas de réseaux trouvés dans l'API."))
                return

            network_ids = [network["id"] for network in networks_data["networks"]]
            self.stdout.write(self.style.SUCCESS(f"Nombre de réseaux trouvés : {len(network_ids)}"))

            for network_id in network_ids:
                try:
                    url = f"https://api.citybik.es/v2/networks/{network_id}"
                    response = requests.get(url)
                    data = response.json()

                    if "network" not in data:
                        continue

                    network_data = data['network']
                    network, _ = Network.objects.update_or_create(
                        external_id=network_data['id'],
                        defaults={
                            'name': network_data['name'],
                            'company': ", ".join(network_data.get('company', [])),
                            'city': network_data['location']['city'],
                            'country': network_data['location']['country'],
                            'latitude': network_data['location']['latitude'],
                            'longitude': network_data['location']['longitude'],
                        }
                    )

                    for station in network_data.get('stations', []):
                        Station.objects.update_or_create(
                            external_id=station['id'],
                            network=network,
                            defaults={
                                'name': station['name'],
                                'free_bikes': station.get('free_bikes', 0),
                                'empty_slots': station.get('empty_slots', 0),
                                'ebikes': station.get('extra', {}).get('ebikes', 0),
                                'address': station.get('extra', {}).get('address', ''),
                            }
                        )
                    self.stdout.write(self.style.SUCCESS(f"Synchronisé : {network_data['name']}"))
                except Exception as network_error:
                    self.stdout.write(self.style.ERROR(f"Erreur pour le réseau {network_id} : {network_error}"))

            self.stdout.write(self.style.SUCCESS("Synchronisation de tous les réseaux terminée."))

        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Erreur globale : {str(e)}"))
