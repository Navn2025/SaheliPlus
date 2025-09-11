import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  Circle,
} from "react-leaflet";
import L from "leaflet";
import io from "socket.io-client";
import "leaflet/dist/leaflet.css";

// Fix default marker issue in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const socket = io("http://localhost:3002");

// Helper function to calculate distance (Haversine formula)
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // meters
  const toRad = (deg) => (deg * Math.PI) / 180;
  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);
  const Δφ = toRad(lat2 - lat1);
  const Δλ = toRad(lon2 - lon1);

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) *
      Math.cos(φ2) *
      Math.sin(Δλ / 2) *
      Math.sin(Δλ / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // in meters
}

// Component to auto-move map to my location
function Recenter({ myLocation }) {
  const map = useMap();
  useEffect(() => {
    if (myLocation) {
      map.setView(myLocation, 16); // zoom in on me
    }
  }, [myLocation, map]);
  return null;
}

export default function LiveMap() {
  const [myLocation, setMyLocation] = useState(null);
  const [users, setUsers] = useState({});

  // Get & watch my location
  useEffect(() => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setMyLocation([latitude, longitude]);
          socket.emit("send-location", { latitude, longitude });
        },
        (error) => console.error(error),
        { enableHighAccuracy: true }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, []);

  // Listen for others
  useEffect(() => {
    socket.on("receive-location", (data) => {
      setUsers((prev) => ({
        ...prev,
        [data.userId]: [data.latitude, data.longitude],
      }));
    });

    return () => {
      socket.off("receive-location");
    };
  }, []);

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <MapContainer
        center={myLocation}
        zoom={16}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://osm.org/copyright">OSM</a> contributors'
        />

        {/* Auto recenter on me */}
        {myLocation && <Recenter myLocation={myLocation} />}

        {/* My location + circle */}
        {myLocation && (
          <>
            <Marker position={myLocation}>
              <Popup>My Location</Popup>
            </Marker>
            <Circle
              center={myLocation}
              radius={500} // 500 meters
              pathOptions={{ color: "blue", fillColor: "blue", fillOpacity: 0.1 }}
            />
          </>
        )}

        {/* All users (different marker if inside/outside 500m) */}
        {myLocation &&
          Object.entries(users).map(([id, coords]) => {
            if (!coords) return null;

            const distance = getDistance(
              myLocation[0],
              myLocation[1],
              coords[0],
              coords[1]
            );

            // Choose icon based on distance
            const icon = new L.Icon({
              iconUrl:
                distance <= 500
                  ? "https://cdn-icons-png.flaticon.com/512/447/447031.png" // green marker
                  : "https://cdn-icons-png.flaticon.com/512/252/252025.png", // red marker
              iconSize: [32, 32],
            });

            return (
              <Marker key={id} position={coords} icon={icon}>
                <Popup>
                  User: {id} ({Math.round(distance)}m away)
                </Popup>
              </Marker>
            );
          })}
      </MapContainer>
    </div>
  );
}
