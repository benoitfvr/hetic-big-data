import "./App.css";

import { useRef, useState } from "react";
import { Map as LeafletMap } from "leaflet";
import { useStationsData } from "@hooks/useStationsData";
import Map from "@components/ui/Map";
import { buildQuery } from "./lib/utils";
import { useCitiesData } from "@hooks/useCitiesData";
import { Checkbox } from "@components/ui/checkbox";
import { useNetworksData } from "@hooks/useNetworksData";

function App() {
  const [filters, setFilters] = useState({
    location: "Paris",
    free_bikes: false,
    ebikes: false,
    network_id: "",
  });

  const stations = useStationsData(buildQuery(filters));
  const networks = useNetworksData();
  const cities = useCitiesData();

  // const [mapWidth, setMapWidth] = useState("75vw");
  const mapRef = useRef<LeafletMap | null>(null);

  const handleCityChange = (e: React.FormEvent<HTMLSelectElement>) => {
    const { value } = e.currentTarget;
    setFilters((prevFilters) => ({ ...prevFilters, location: value }));
  };

  const handleNetworkChange = (e: React.FormEvent<HTMLSelectElement>) => {
    const { value } = e.currentTarget;
    setFilters((prevFilters) => ({ ...prevFilters, network_id: value }));
  };

  const handleChangeEbikes = (checked: boolean) => {
    setFilters((prevFilters) => ({ ...prevFilters, ebikes: checked }));
  };

  const handleChangeFreeBikes = (checked: boolean) => {
    setFilters((prevFilters) => ({ ...prevFilters, free_bikes: checked }));
  };

  // useEffect(() => {
  //   const handleScroll = () => {
  //     const scrollPosition = window.scrollY;
  //     const newWidth = Math.min(75 + scrollPosition / 10, 97);
  //     setMapWidth(`${newWidth}vw`);
  //   };

  //   window.addEventListener("scroll", handleScroll);
  //   return () => window.removeEventListener("scroll", handleScroll);
  // }, []);

  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center h-[50vh]">
          <h1 className="text-2xl font-bold">
            Browse the best France bike data
          </h1>
        </div>

        <div className="p-4 border-2 border-gray-200 mb-2">
          <div className="flex items-center justify-between w-full mb-2 p-4 bg-white border">
            <div className="flex items-center space-x-6">
              <div>
                <label
                  htmlFor="ebikes"
                  className="block text-sm font-medium text-gray-700"
                >
                  E-bikes
                </label>
                <Checkbox
                  id="ebikes"
                  name="ebikes"
                  checked={filters.ebikes}
                  onCheckedChange={handleChangeEbikes}
                />
              </div>

              <div>
                <label
                  htmlFor="free_bikes"
                  className="block text-sm font-medium text-gray-700"
                >
                  Free Bikes
                </label>
                <Checkbox
                  id="free_bikes"
                  name="free_bikes"
                  checked={filters.free_bikes}
                  onCheckedChange={handleChangeFreeBikes}
                />
              </div>

              <div>
                <label
                  htmlFor="cities"
                  className="block text-sm font-medium text-gray-700"
                >
                  City
                </label>
                <select
                  id="cities"
                  className="mt-1 block w-40 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  onChange={handleCityChange}
                  value={filters.location}
                >
                  <option value="">Select a city</option> {/* Default option */}
                  {cities.map((c) => (
                    <option value={c} key={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="network"
                  className="block text-sm font-medium text-gray-700"
                >
                  Network
                </label>
                <select
                  id="network"
                  className="mt-1 block w-40 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  onChange={handleNetworkChange}
                  value={filters.network_id}
                >
                  <option value="">Select a network</option>{" "}
                  {/* Default option */}
                  {networks.map((n) => (
                    <option value={n.external_id} key={n.id}>
                      {n.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="w-fit overflow-hidden" style={{ width: "97%" }}>
            <Map mapRef={mapRef} stations={stations} />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
