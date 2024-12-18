import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

export const useCitiesData = (): string[] => {
  const [cities, setCities] = useState<string[]>([]);

  useEffect(() => {
    fetch(API_URL + "/cities")
      .then((response) => response.json())
      .then((data) => setCities(data.cities))
      .catch((error) => console.error("Error:", error));
  }, []);

  return cities;
};
