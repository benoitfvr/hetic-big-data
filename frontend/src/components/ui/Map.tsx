import {
  Circle,
  LayerGroup,
  MapContainer,
  Popup,
  TileLayer,
} from "react-leaflet";
import { Network } from "src/types/Network";
import { Map as LeafletMap } from "leaflet";

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet-defaulticon-compatibility";

type MapProps = {
  networks: Network[];
  mapRef: React.LegacyRef<LeafletMap>;
};

const Map = ({ networks, mapRef }: MapProps) => {
  const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_KEY;
  const MAPBOX_STYLE_ID = "mapbox/streets-v11"; // Change this to your preferred map style

  return (
    <MapContainer
      ref={mapRef}
      style={{
        height: "86vh",
        width: "97vw",
      }}
      center={[46.864716, 2.349014]}
      zoom={6}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution="© Mapbox © OpenStreetMap contributors"
        url={`https://api.mapbox.com/styles/v1/${MAPBOX_STYLE_ID}/tiles/{z}/{x}/{y}?access_token=${MAPBOX_ACCESS_TOKEN}`}
      />
      <LayerGroup>
        {networks.map((network) =>
          network.stations.map((station) => (
            <Circle
              key={station.id}
              center={[station.latitude, station.longitude]}
              pathOptions={{ color: "blue", fillColor: "blue" }}
              radius={200}
            >
              <Popup>
                <strong>{station.name}</strong>
                <br />
                Free Bikes: {station.free_bikes}
                <br />
                Empty Slots: {station.empty_slots}
              </Popup>
            </Circle>
          ))
        )}
      </LayerGroup>
    </MapContainer>
  );
};

export default Map;
