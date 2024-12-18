import { Station } from "src/types/Network";
import { useEffect, useState, useRef } from "react";

export const useStationsData = (filters: string): Station[] => {
  const [stations, setStations] = useState<Station[]>([]); // Données des stations
  const ws = useRef<WebSocket | null>(null); // Référence pour le WebSocket
  const filtersRef = useRef<string>(filters); // Garde une trace des filtres précédents

  // WebSocket : connexion unique et gestion des messages
  useEffect(() => {
    ws.current = new WebSocket("ws://127.0.0.1:8000/ws/stations/");

    ws.current.onopen = () => {
      console.log("WebSocket connecté !");
      ws.current?.send(
        JSON.stringify({
          action: "set_filters",
          filters: parseFilters(filters),
        })
      );
    };

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "station_update") {
        console.log(data.stations);
        setStations(data.stations); // Met à jour les données reçues via WebSocket
      }
    };

    ws.current.onerror = (error) => console.error("WebSocket Error:", error);

    ws.current.onclose = () => console.log("WebSocket déconnecté.");

    return () => {
      ws.current?.close(); // Ferme proprement la connexion WebSocket à la destruction
    };
  }, []); // Se connecte une seule fois

  // Envoi des filtres dynamiques via WebSocket
  useEffect(() => {
    if (filters !== filtersRef.current) {
      filtersRef.current = filters;
      if (ws.current?.readyState === WebSocket.OPEN) {
        ws.current.send(
          JSON.stringify({
            action: "set_filters",
            filters: parseFilters(filters),
          })
        );
        console.log("Filtres mis à jour via WebSocket :", filters);
      }
    }
  }, [filters]);

  return stations;
};

// Fonction pour parser les filtres en objet JSON
const parseFilters = (filters: string) => {
  const params = new URLSearchParams(filters);
  const parsed: Record<string, string> = {};
  for (const [key, value] of params.entries()) {
    parsed[key] = value;
  }
  return parsed;
};
