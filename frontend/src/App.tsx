import "./App.css";
import {
  Circle,
  FeatureGroup,
  LayerGroup,
  MapContainer,
  Popup,
  Rectangle,
  TileLayer,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet-defaulticon-compatibility";
import { useEffect, useState, useRef } from "react";
import { Map as LeafletMap } from 'leaflet';

function App() {
  const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_KEY;
  const MAPBOX_STYLE_ID = "mapbox/streets-v11"; // Change this to your preferred map style

  const center = [51.505, -0.09];
  const rectangle = [
    [51.49, -0.08],
    [51.5, -0.06],
  ];

  const fillBlueOptions = { fillColor: "blue" };
  const fillRedOptions = { fillColor: "red" };
  const greenOptions = { color: "green", fillColor: "green" };
  const purpleOptions = { color: "purple" };

  const [mapWidth, setMapWidth] = useState("75vw");
  const mapRef = useRef<LeafletMap | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const newWidth = Math.min(75 + (scrollPosition / 10), 97);
      setMapWidth(`${newWidth}vw`);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
    <div className="flex flex-col items-center justify-center">

      <div className="flex flex-col items-center justify-center h-[50vh]">
        <h1 className="text-2xl font-bold">Browse the best France bike data</h1>
      </div>

      <div className="p-4 border-2 border-gray-200 mb-2">

      <div className="flex items-center justify-between w-full mb-2 p-4 bg-white border">
        <div className="flex items-center space-x-4">
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">Type</label>
            <select id="type" className="mt-1 block w-40 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
              <option>Tous</option>
              <option>Vélos</option>
              <option>Stations</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="region" className="block text-sm font-medium text-gray-700">Région</label>
            <select id="region" className="mt-1 block w-40 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
              <option>Toutes</option>
              <option>Île-de-France</option>
              <option>Auvergne-Rhône-Alpes</option>
            </select>
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">Statut</label>
            <select id="status" className="mt-1 block w-40 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
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

      <div className="w-fit overflow-hidden" style={{ width: mapWidth }}>
        <MapContainer
          ref={mapRef}
          style={{
            height: "86vh",
            width: "97vw",
          }}
          center={[51.505, -0.09]}
          zoom={13}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution="© Mapbox © OpenStreetMap contributors"
            url={`https://api.mapbox.com/styles/v1/${MAPBOX_STYLE_ID}/tiles/{z}/{x}/{y}?access_token=${MAPBOX_ACCESS_TOKEN}`}
          />
          <LayerGroup>
            <Circle
              center={center}
              pathOptions={fillBlueOptions}
              radius={200}
            />
            <Circle
              center={center}
              pathOptions={fillRedOptions}
              radius={100}
              stroke={false}
            />
            <LayerGroup>
              <Circle
                center={[51.51, -0.08]}
                pathOptions={greenOptions}
                radius={100}
              />
            </LayerGroup>
          </LayerGroup>
          <FeatureGroup pathOptions={purpleOptions}>
            <Popup>Popup in FeatureGroup</Popup>
            <Circle center={[51.51, -0.06]} radius={200} />
            <Rectangle bounds={rectangle} />
          </FeatureGroup>
        </MapContainer>
      </div>
      </div>
      </div>
    </>
  );
}

export default App;
