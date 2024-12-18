import { Station } from "src/types/Network";
import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

export const useNetworksData = (filters: string): Station[] => {
  const [networks, setNetworks] = useState<Station[]>([]);

  useEffect(() => {
    fetch(API_URL + "/stations?" + filters)
      .then((response) => response.json())
      .then((data) => setNetworks(data.stations))
      .catch((error) => console.error("Error:", error));
  }, [filters]);

  return networks;
};
