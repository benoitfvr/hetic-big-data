import json
from django.core.management.base import BaseCommand
from core.models import Penalty
import os

base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


class Command(BaseCommand):
    help = "Load penalty data from dpmp-verbalisations.json file into the Penalty model"

    def handle(self, *args, **kwargs):
        file_path = os.path.join(
            base_dir, "management", "data", "dpmp-verbalisations.json"
        )

        try:
            with open(file_path, "r") as file:
                data = json.load(file)

                for item in data:
                    Penalty.objects.create(
                        penalty_type=item["type_infraction"],
                        penalty_category=item["categorie_infraction"],
                        borough=item["arrondissement"],
                        neighborhood_council=item["conseil_de_quartier"],
                        period=item["periode"],
                        penalty_number=item["nb_verbalisation"],
                        year=item["annee"],
                        quarter=item["trimestre"],
                    )

            self.stdout.write(
                self.style.SUCCESS("Successfully loaded data into Penalty model")
            )

        except FileNotFoundError:
            self.stdout.write(self.style.ERROR(f"File {file_path} not found"))

        except json.JSONDecodeError:
            self.stdout.write(self.style.ERROR("Error decoding JSON"))

        except Exception as e:
            self.stdout.write(self.style.ERROR(f"An error occurred: {e}"))
