import {
  LayerGroup,
  MapContainer,
  Popup,
  TileLayer,
  GeoJSON,
  Circle,
} from "react-leaflet";
import { Station } from "src/types/Network";
import { Map as LeafletMap } from "leaflet";
import React from "react";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet-defaulticon-compatibility";
import { Penalty } from "../../types/Penalty";

const API_URL = import.meta.env.VITE_API_URL;

interface Arrondissement {
  n_sq_ar: number;
  c_ar: number;
  l_ar: string;
  l_aroff: string;
  geom: {
    type: string;
    geometry: GeoJSON.Geometry;
  };
}

type MapProps = {
  stations: Station[];
  mapRef: React.LegacyRef<LeafletMap>;
};

const Map = ({ stations, mapRef }: MapProps) => {
  const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_KEY;
  const MAPBOX_STYLE_ID = "mapbox/streets-v11";

  const [verbalisations, setVerbalisations] = React.useState<Penalty[]>([]);
  const [arrondissements, setArrondissements] = React.useState<
    Arrondissement[]
  >([]);
  const [activeLayerIds, setActiveLayerIds] = React.useState([
    "stations",
    "verbalisations",
  ]);

  // Charger les verbalisations
  React.useEffect(() => {
    fetch(API_URL + "/penalties")
      .then((response) => response.json())
      .then((data) => {
        console.log("Verbalisations loaded:", data);
        setVerbalisations(data.penalties);
      })
      .catch((error) => console.error("Error loading verbalisations:", error));
  }, []);

  // Charger les arrondissements
  React.useEffect(() => {
    fetch("/arrondissements.json")
      .then((response) => response.json())
      .then((data) => {
        console.log("Arrondissements loaded:", data);
        setArrondissements(data);
      })
      .catch((error) => console.error("Error loading arrondissements:", error));
  }, []);

  // Calculer le nombre total d'infractions par arrondissement
  const getInfractionsParArrondissement = (numArrondissement: number) => {
    const arrStr =
      numArrondissement < 10
        ? `7500${numArrondissement}`
        : `750${numArrondissement}`;
    return verbalisations
      .filter((v) => v.borough === arrStr)
      .reduce((sum, v) => sum + v.penalty_number, 0);
  };

  // Style pour les polygones des arrondissements
  const getArrondissementStyle = (feature: any) => {
    const nbInfractions = getInfractionsParArrondissement(
      feature.properties.c_ar
    );

    // Définir la couleur en fonction du nombre d'infractions
    let fillColor;
    if (nbInfractions === 0) {
      fillColor = "#FFEDA080"; // Jaune très clair pour aucune infraction
    } else if (nbInfractions < 1000) {
      fillColor = "#FED97680"; // Jaune clair
    } else if (nbInfractions < 2000) {
      fillColor = "#FEB24C90"; // Orange clair
    } else if (nbInfractions < 3000) {
      fillColor = "#FD8D3C90"; // Orange
    } else if (nbInfractions < 4000) {
      fillColor = "#FC4E2A90"; // Orange foncé
    } else if (nbInfractions < 5000) {
      fillColor = "#E31A1C90"; // Rouge
    } else if (nbInfractions < 6000) {
      fillColor = "#BD002D90"; // Rouge foncé
    } else if (nbInfractions < 7000) {
      fillColor = "#9A002490"; // Rouge très foncé
    } else if (nbInfractions < 8000) {
      fillColor = "#77001B90"; // Bordeaux
    } else if (nbInfractions < 9000) {
      fillColor = "#54001390"; // Bordeaux foncé
    } else if (nbInfractions < 10000) {
      fillColor = "#31000A90"; // Bordeaux très foncé
    } else {
      fillColor = "#0E000290"; // Presque noir
    }

    return {
      fillColor: fillColor,
      weight: 2,
      opacity: 1,
      color: "#666",
      fillOpacity: 0.9,
      dashArray: "3",
    };
  };

  // Convertir les arrondissements en format GeoJSON
  const arrondissementsGeoJSON: GeoJSON.FeatureCollection = {
    type: "FeatureCollection" as const,
    features: arrondissements.map((arr) => ({
      type: "Feature" as const,
      properties: {
        c_ar: arr.c_ar,
        l_ar: arr.l_ar,
        l_aroff: arr.l_aroff,
      },
      geometry: arr.geom.geometry,
    })),
  };

  return (
    <>
      <div
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          zIndex: 1000,
          backgroundColor: "white",
          padding: "10px",
          borderRadius: "4px",
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        }}
      >
        <button
          onClick={() =>
            setActiveLayerIds((prev) =>
              prev.includes("stations")
                ? prev.filter((id) => id !== "stations")
                : [...prev, "stations"]
            )
          }
          style={{
            backgroundColor: activeLayerIds.includes("stations")
              ? "#3887be"
              : "#fff",
            color: activeLayerIds.includes("stations") ? "#fff" : "#404040",
            margin: "0 5px",
            padding: "5px 10px",
            border: "1px solid #ddd",
            borderRadius: "3px",
            cursor: "pointer",
          }}
        >
          Stations
        </button>
        <button
          onClick={() =>
            setActiveLayerIds((prev) =>
              prev.includes("verbalisations")
                ? prev.filter((id) => id !== "verbalisations")
                : [...prev, "verbalisations"]
            )
          }
          style={{
            backgroundColor: activeLayerIds.includes("verbalisations")
              ? "#3887be"
              : "#fff",
            color: activeLayerIds.includes("verbalisations")
              ? "#fff"
              : "#404040",
            margin: "0 5px",
            padding: "5px 10px",
            border: "1px solid #ddd",
            borderRadius: "3px",
            cursor: "pointer",
          }}
        >
          Infractions
        </button>
      </div>

      <MapContainer
        ref={mapRef}
        style={{
          height: "86vh",
          width: "97vw",
        }}
        center={[48.8566, 2.3522]}
        zoom={12}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution="© Mapbox © OpenStreetMap contributors"
          url={`https://api.mapbox.com/styles/v1/${MAPBOX_STYLE_ID}/tiles/{z}/{x}/{y}?access_token=${MAPBOX_ACCESS_TOKEN}`}
        />

        {activeLayerIds.includes("verbalisations") &&
          arrondissements.length > 0 &&
          verbalisations.length > 0 && (
            <LayerGroup>
              <GeoJSON
                data={arrondissementsGeoJSON}
                style={getArrondissementStyle}
                onEachFeature={(feature, layer) => {
                  const nbInfractions = getInfractionsParArrondissement(
                    feature.properties.c_ar
                  );

                  layer.bindPopup(`
                  <strong>${feature.properties.l_ar}</strong><br/>
                  ${feature.properties.l_aroff}<br/>
                  Nombre d'infractions: ${nbInfractions}
                `);
                }}
              />
            </LayerGroup>
          )}

        {activeLayerIds.includes("stations") && stations.length > 0 && (
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
      </MapContainer>
    </>
  );
};

export default Map;
