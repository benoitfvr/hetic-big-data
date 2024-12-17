import "./App.css";

import { useRef } from "react";
import { Map as LeafletMap } from "leaflet";
import { useNetworksData } from "@hooks/useNetworksData";
import Map from "@components/ui/Map";

function App() {
  const networks = useNetworksData();

  // const [mapWidth, setMapWidth] = useState("75vw");
  const mapRef = useRef<LeafletMap | null>(null);

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
            <div className="flex items-center space-x-4">
              <div>
                <label
                  htmlFor="type"
                  className="block text-sm font-medium text-gray-700"
                >
                  Type
                </label>
                <select
                  id="type"
                  className="mt-1 block w-40 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option>Tous</option>
                  <option>Vélos</option>
                  <option>Stations</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="region"
                  className="block text-sm font-medium text-gray-700"
                >
                  Région
                </label>
                <select
                  id="region"
                  className="mt-1 block w-40 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option>Toutes</option>
                  <option>Île-de-France</option>
                  <option>Auvergne-Rhône-Alpes</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700"
                >
                  Statut
                </label>
                <select
                  id="status"
                  className="mt-1 block w-40 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option>Tous</option>
                  <option>Disponible</option>
                  <option>Indisponible</option>
                </select>
              </div>
            </div>

            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              Filtrer
            </button>
          </div>

          <div className="w-fit overflow-hidden" style={{ width: "97%" }}>
            <Map mapRef={mapRef} networks={networks} />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
