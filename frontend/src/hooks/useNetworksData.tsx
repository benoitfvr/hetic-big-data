import { Network } from "src/types/Network";
import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

export const useNetworksData = (): Network[] => {
  const [networks, setNetworks] = useState<Network[]>([]);

  useEffect(() => {
    fetch(API_URL + "/networks")
      .then((response) => response.json())
      .then((data) => setNetworks(data))
      .catch((error) => console.error("Error:", error));
  }, []);

  return networks;
};
