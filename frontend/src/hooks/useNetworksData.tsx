import { useEffect, useState } from "react";
import { Network } from "src/types/Network";

const API_URL = import.meta.env.VITE_API_URL;

export const useNetworksData = (): Network[] => {
  const [networks, setNetworks] = useState<Network[]>([]);

  useEffect(() => {
    fetch(API_URL + "/networks")
      .then((response) => response.json())
      .then((data) =>
        setNetworks([
          ...data.map((data: Network) => ({
            id: data.id,
            name: data.name,
            external_id: data.external_id,
          })),
        ])
      )
      .catch((error) => console.error("Error:", error));
  }, []);

  return networks;
};
