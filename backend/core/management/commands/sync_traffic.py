import json
from django.core.management.base import BaseCommand
from core.models import TrafficEvent
import os

base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


class Command(BaseCommand):
    help = "Load traffic data from circulation_json file into the TrafficEvent model"

    def handle(self, *args, **kwargs):
        file_path = os.path.join(
            base_dir, "management", "data", "circulation_evenement.json"
        )

        try:
            with open(file_path, "r") as file:
                data = json.load(file)

                for item in data:
                    geopoints = item["polyline"].split(" ")

                    TrafficEvent.objects.create(
                        start_time=item["starttime"],
                        end_time=item["endtime"],
                        description=item["description"],
                        street=item["street"],
                        type=item["type"],
                        subtype=item["subtype"],
                        lat1=float(geopoints[0]),
                        lon1=float(geopoints[1]),
                        lat2=float(geopoints[2]),
                        lon2=float(geopoints[3]),
                        direction=item["direction"],
                    )

            self.stdout.write(
                self.style.SUCCESS("Successfully loaded data into TrafficEvent model")
            )

        except FileNotFoundError:
            self.stdout.write(self.style.ERROR(f"File {file_path} not found"))

        except json.JSONDecodeError:
            self.stdout.write(self.style.ERROR("Error decoding JSON"))

        except Exception as e:
            self.stdout.write(self.style.ERROR(f"An error occurred: {e}"))
