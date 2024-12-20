import { useEffect, useState } from "react";
import { Penalty } from "src/types/Penalty";

const API_URL = import.meta.env.VITE_API_URL;

export const usePenaltyData = () => {
  const [penalties, setPenalties] = useState<Penalty[]>([]);

  useEffect(() => {
    fetch(API_URL + "/penalties")
      .then((response) => response.json())
      .then((data) => {
        console.log("Penalties loaded:", data);
        setPenalties(data.penalties);
      })
      .catch((error) => console.error("Error loading penalties:", error));
  }, []);

  return penalties;
};
