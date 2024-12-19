import { Bar, BarChart, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { type ChartConfig, ChartContainer } from "../components/ui/chart";
import { useStationsData } from "@hooks/useStationsData";
import { useNetworksData } from "@hooks/useNetworksData";
import { useMemo, useState, useEffect } from "react";
import { PieChart, Pie, Cell } from "recharts";
import { Penalty } from "src/types/Penalty";
const API_URL = import.meta.env.VITE_API_URL;

export default function Stats() {
  // Récupération des données
  const stations = useStationsData("");
  const networks = useNetworksData();

  // Nouvelles données
  const [verbalisations, setVerbalisations] = useState<Penalty[]>([]);
  const [arrondissements, setArrondissements] = useState<any[]>([]);

  // Charger les données
  useEffect(() => {
    fetch(API_URL + "/penalties")
      .then((response) => response.json())
      .then((data) => {
        console.log("Verbalisations loaded:", data);
        setVerbalisations(data.penalties);
      })
      .catch((error) => console.error("Error loading verbalisations:", error));

    fetch("/arrondissements.json")
      .then((response) => response.json())
      .then((data) => setArrondissements(data))
      .catch((error) =>
        console.error("Erreur chargement arrondissements:", error)
      );
  }, []);

  // Préparation des données pour les graphiques
  const networkStats = useMemo(() => {
    if (!stations.length) {
      console.log("Pas de stations disponibles");
      return [];
    }

    // Grouper les stations par réseau
    const statsParReseau = stations.reduce((acc, station) => {
      const networkName = station.network || "Inconnu";

      if (!acc[networkName]) {
        acc[networkName] = {
          name: networkName,
          total_bikes: 0,
          ebikes: 0,
        };
      }

      acc[networkName].total_bikes +=
        (station.free_bikes || 0) + (station.ebikes || 0);
      acc[networkName].ebikes += station.ebikes || 0;

      return acc;
    }, {} as Record<string, { name: string; total_bikes: number; ebikes: number }>);

    const stats = Object.values(statsParReseau);
    console.log("Statistiques des stations:", stats);
    return stats;
  }, [stations]);

  // Statistiques sur les infractions
  const infractionStats = useMemo(() => {
    const statsParArrondissement = arrondissements.map((arr) => {
      const arrStr = arr.c_ar < 10 ? `7500${arr.c_ar}` : `750${arr.c_ar}`;
      const nbInfractions = verbalisations
        .filter((v) => v.borough === arrStr)
        .reduce((sum, v) => sum + v.penalty_number, 0);

      return {
        name: `${arr.l_ar}`,
        infractions: nbInfractions,
      };
    });
    return statsParArrondissement;
  }, [verbalisations, arrondissements]);

  const availabilityStats = useMemo(() => {
    if (!stations.length) return [];

    return [
      {
        name: "Stations avec vélos",
        value: stations.filter((s) => (s.free_bikes || 0) > 0).length,
      },
      {
        name: "Stations vides",
        value: stations.filter((s) => (s.free_bikes || 0) === 0).length,
      },
    ];
  }, [stations]);

  const capacityStats = useMemo(() => {
    if (!stations.length) return [];

    return stations
      .map((station) => ({
        name: station.name,
        capacité: (station.free_bikes || 0) + (station.empty_slots || 0),
        vélos_disponibles: station.free_bikes || 0,
        places_libres: station.empty_slots || 0,
      }))
      .sort((a, b) => b.capacité - a.capacité)
      .slice(0, 10);
  }, [stations]);

  const bikeTypeDistribution = useMemo(() => {
    if (!stations.length) return [];

    const totalBikes = stations.reduce(
      (sum, s) => sum + (s.free_bikes || 0),
      0
    );
    const totalEbikes = stations.reduce((sum, s) => sum + (s.ebikes || 0), 0);

    return [
      { name: "Vélos classiques", value: totalBikes - totalEbikes },
      { name: "Vélos électriques", value: totalEbikes },
    ];
  }, [stations]);

  const occupancyRateStats = useMemo(() => {
    if (!stations.length) return [];

    const getOccupancyCategory = (station: any) => {
      const total = (station.free_bikes || 0) + (station.empty_slots || 0);
      if (total === 0) return "Non opérationnelle";

      const occupancyRate = ((station.free_bikes || 0) / total) * 100;

      if (occupancyRate === 0) return "Vide (0%)";
      if (occupancyRate < 25) return "Presque vide (1-24%)";
      if (occupancyRate < 50) return "Peu remplie (25-49%)";
      if (occupancyRate < 75) return "Bien remplie (50-74%)";
      if (occupancyRate < 100) return "Presque pleine (75-99%)";
      return "Pleine (100%)";
    };

    const categories = stations.reduce((acc, station) => {
      const category = getOccupancyCategory(station);
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(categories).map(([name, value]) => ({ name, value }));
  }, [stations]);

  const chartConfig = {
    total_bikes: {
      label: "Vélos totaux",
      color: "#2563eb",
    },
    ebikes: {
      label: "Vélos électriques",
      color: "#60a5fa",
    },
  } satisfies ChartConfig;

  const infractionConfig = {
    infractions: {
      label: "Infractions",
      color: "#ef4444",
    },
  } satisfies ChartConfig;

  return (
    <div className="container mx-auto px-4 py-8 mt-32 max-w-screen-lg">
      <h1 className="text-3xl font-bold mb-8">
        Statistiques des Vélos en France
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">
            Distribution par Réseau
          </h2>
          <ChartContainer config={chartConfig} className="h-[400px] w-full">
            <BarChart
              width={600}
              height={300}
              data={networkStats}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="total_bikes"
                name="Vélos totaux"
                fill="var(--color-total_bikes)"
                radius={4}
              />
              <Bar
                dataKey="ebikes"
                name="Vélos électriques"
                fill="var(--color-ebikes)"
                radius={4}
              />
            </BarChart>
          </ChartContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">
            Infractions par Arrondissement
          </h2>
          <ChartContainer
            config={infractionConfig}
            className="h-[400px] w-full"
          >
            <BarChart
              width={600}
              height={300}
              data={infractionStats}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="infractions" fill="#ef4444" radius={4} />
            </BarChart>
          </ChartContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">
            Disponibilité des Stations
          </h2>
          <ChartContainer config={chartConfig} className="h-[400px] w-full">
            <PieChart width={400} height={300}>
              <Pie
                data={availabilityStats}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
              >
                {availabilityStats.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={index === 0 ? "#22c55e" : "#ef4444"}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ChartContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">
            Top 10 Stations par Capacité
          </h2>
          <ChartContainer config={chartConfig} className="h-[400px] w-full">
            <BarChart
              width={600}
              height={300}
              data={capacityStats}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="vélos_disponibles" stackId="a" fill="#22c55e" />
              <Bar dataKey="places_libres" stackId="a" fill="#94a3b8" />
            </BarChart>
          </ChartContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">
            Distribution Vélos Classiques vs Électriques
          </h2>
          <ChartContainer config={chartConfig} className="h-[400px] w-full">
            <PieChart width={400} height={300}>
              <Pie
                data={bikeTypeDistribution}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
              >
                <Cell fill="#3b82f6" />
                <Cell fill="#60a5fa" />
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ChartContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">
            Distribution du Taux de Remplissage
          </h2>
          <ChartContainer config={chartConfig} className="h-[400px] w-full">
            <BarChart
              width={600}
              height={300}
              data={occupancyRateStats}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8b5cf6" radius={4} />
            </BarChart>
          </ChartContainer>
        </div>
      </div>
    </div>
  );
}
