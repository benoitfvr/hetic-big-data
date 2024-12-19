import {
  Circle,
  LayerGroup,
  MapContainer,
  Popup,
  TileLayer,
  Polyline,
} from "react-leaflet";
import { Station } from "src/types/Network";
import { Map as LeafletMap } from "leaflet";
import React from "react";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet-defaulticon-compatibility";

interface CirculationEvent {
  id: string;
  description: string;
  type: string;
  street: string;
  polyline: string;
  direction: string;
  starttime: string;
  endtime: string;
}

type MapProps = {
  stations: Station[];
  mapRef: React.LegacyRef<LeafletMap>;
};

const Map = ({ stations, mapRef }: MapProps) => {
  const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_KEY;
  const MAPBOX_STYLE_ID = "mapbox/streets-v11"; // Change this to your preferred map style

  const [circulationEvents, setCirculationEvents] = React.useState<CirculationEvent[]>([]);
  const [activeLayerIds, setActiveLayerIds] = React.useState(['stations', 'circulation']);

  React.useEffect(() => {
    fetch('/circulation_evenement.json')
      .then(response => response.json())
      .then(data => {
        console.log("Circulation events loaded:", data);
        setCirculationEvents(data);
      })
      .catch(error => console.error("Error loading circulation events:", error));
  }, []);

  console.log("Current stations:", stations);
  console.log("Current circulation events:", circulationEvents);
  console.log("Active layers:", activeLayerIds);

  const parsePolyline = (polylineStr: string): [number, number][] => {
    return polylineStr.split(' ')
      .reduce((acc: [number, number][], curr: string, i: number, arr: string[]) => {
        if (i % 2 === 0) {
          acc.push([parseFloat(curr), parseFloat(arr[i + 1])]);
        }
        return acc;
      }, []);
  };

  return (
    <>
      <div style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        zIndex: 1000,
        backgroundColor: 'white',
        padding: '10px',
        borderRadius: '4px',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)'
      }}>
        <button
          onClick={() => setActiveLayerIds(prev => 
            prev.includes('stations') ? prev.filter(id => id !== 'stations') : [...prev, 'stations']
          )}
          style={{
            backgroundColor: activeLayerIds.includes('stations') ? '#3887be' : '#fff',
            color: activeLayerIds.includes('stations') ? '#fff' : '#404040',
            margin: '0 5px',
            padding: '5px 10px',
            border: '1px solid #ddd',
            borderRadius: '3px',
            cursor: 'pointer'
          }}
        >
          Stations
        </button>
        <button
          onClick={() => setActiveLayerIds(prev => 
            prev.includes('circulation') ? prev.filter(id => id !== 'circulation') : [...prev, 'circulation']
          )}
          style={{
            backgroundColor: activeLayerIds.includes('circulation') ? '#3887be' : '#fff',
            color: activeLayerIds.includes('circulation') ? '#fff' : '#404040',
            margin: '0 5px',
            padding: '5px 10px',
            border: '1px solid #ddd',
            borderRadius: '3px',
            cursor: 'pointer'
          }}
        >
          Circulation
        </button>
      </div>

      <MapContainer
        ref={mapRef}
        style={{
          height: "86vh",
          width: "97vw",
        }}
        center={[48.8566, 2.3522]}
        zoom={13}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution="© Mapbox © OpenStreetMap contributors"
          url={`https://api.mapbox.com/styles/v1/${MAPBOX_STYLE_ID}/tiles/{z}/{x}/{y}?access_token=${MAPBOX_ACCESS_TOKEN}`}
        />
        
        {/* Groupe des stations de vélo */}
        {activeLayerIds.includes('stations') && stations.length > 0 && (
          <LayerGroup>
            {stations.map((station) => (
              <Circle
                key={
                  station.name +
                  station.network +
                  station.latitude.toString() +
                  station.longitude.toString()
                }
                center={[station.latitude, station.longitude]}
                pathOptions={
                  station.free_bikes <= 5 && station.free_bikes > 0
                    ? { color: "orange", fillColor: "orange" }
                    : station.free_bikes === 0
                    ? { color: "red", fillColor: "red" }
                    : { color: "green", fillColor: "green" }
                }
                radius={20}
              >
                <Popup>
                  <strong>{station.name}</strong>
                  <br />
                  Free Bikes: {station.free_bikes}
                  <br />
                  Empty Slots: {station.empty_slots}
                </Popup>
              </Circle>
            ))}
          </LayerGroup>
        )}

        {/* Groupe des événements de circulation */}
        {activeLayerIds.includes('circulation') && circulationEvents.length > 0 && (
          <LayerGroup>
            {circulationEvents.map((event) => (
              <Polyline
                key={event.id}
                positions={parsePolyline(event.polyline)}
                pathOptions={{
                  color: event.type === 'ROAD_CLOSED' ? 'red' : 'orange',
                  weight: 3,
                }}
              >
                <Popup>
                  <strong>{event.street}</strong>
                  <br />
                  {event.description}
                  <br />
                  Type: {event.type}
                  <br />
                  Du: {new Date(event.starttime).toLocaleDateString()}
                  <br />
                  Au: {new Date(event.endtime).toLocaleDateString()}
                </Popup>
              </Polyline>
            ))}
          </LayerGroup>
        )}
      </MapContainer>
    </>
  );
};

export default Map;
