import React, {useEffect, useState, useMemo, useRef} from "react";
import
{
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

// (Your leaflet icon fix and getDistance function remain unchanged)
// ...

const socket=io("http://localhost:3000");

// --- HELPER COMPONENTS ---
function Recenter({myLocation})
{
  const map=useMap();
  useEffect(() =>
  {
    if (myLocation)
    {
      map.setView(myLocation);
    }
  }, [myLocation, map]);
  return null;
}

// --- MAIN PAGE COMPONENT ---
export default function SaheliCirclePage()
{
  const [myLocation, setMyLocation]=useState(null);
  const [users, setUsers]=useState({});
  const [selectedUserId, setSelectedUserId]=useState(null);

  // (Your existing useEffects for geolocation and socket listeners remain unchanged)
  // ...

  const sortedUsers=useMemo(() =>
  {
    if (!myLocation) return [];
    return Object.entries(users)
      .map(([id, coords]) =>
      {
        const distance=getDistance(myLocation[0], myLocation[1], coords[0], coords[1]);
        return {id, coords, distance};
      })
      .sort((a, b) => a.distance-b.distance);
  }, [users, myLocation]);

  const handleSosClick=() =>
  {
    alert("SOS Alert Triggered! Your circle and emergency contacts have been notified.");
  };

  if (!myLocation)
  {
    return <div className="flex items-center justify-center h-screen">Loading Your Saheli Circle...</div>;
  }

  return (
    // Responsive Layout: flex-col on mobile, flex-row on medium screens and up
    <div className="font-sans flex flex-col md:flex-row h-screen w-full">

      {/* --- HEADER --- */}
      <header className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-white px-5 py-2.5 rounded-lg shadow-lg flex items-center gap-5">
        <h1 className="text-2xl font-semibold text-pink-600">Saheli Circle</h1>
        <button
          onClick={handleSosClick}
          className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-full shadow-md transition-colors duration-200"
        >
          SOS
        </button>
      </header>

      {/* --- SIDEBAR --- */}
      <UserListPanel
        users={sortedUsers}
        onSelectUser={(userId) => setSelectedUserId(userId)}
      />

      {/* --- MAP --- */}
      <div className="flex-grow h-[60vh] md:h-screen">
        <LiveMap
          myLocation={myLocation}
          users={users}
          selectedUserId={selectedUserId}
        />
      </div>
    </div>
  );
}

// --- SIDEBAR COMPONENT ---
function UserListPanel({users, onSelectUser})
{
  return (
    <aside className="w-full md:w-[350px] bg-gray-50 border-b md:border-b-0 md:border-r border-gray-200 flex flex-col h-[40vh] md:h-screen">
      <div className="p-4 border-b border-gray-200 bg-white">
        <h2 className="text-lg font-semibold">Members ({users.length})</h2>
      </div>
      <ul className="list-none p-0 m-0 overflow-y-auto flex-grow">
        {users.map((user) => (
          <li
            key={user.id}
            className="flex items-center p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors duration-200"
            onClick={() => onSelectUser(user.id)}
          >
            <div className={`w-3 h-3 rounded-full mr-4 ${user.distance<=500? 'bg-green-600':'bg-gray-500'}`}></div>
            <div className="flex-grow">
              <strong className="block">{user.id}</strong>
              <span className="text-gray-600 text-sm">{Math.round(user.distance)}m away</span>
            </div>
            <div className="flex gap-2">
              <button title="Call" className="w-10 h-10 rounded-full border border-gray-300 text-gray-600 hover:bg-pink-600 hover:text-white hover:border-pink-600 transition-colors duration-200">📞</button>
              <button title="Message" className="w-10 h-10 rounded-full border border-gray-300 text-gray-600 hover:bg-pink-600 hover:text-white hover:border-pink-600 transition-colors duration-200">💬</button>
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
}

// --- MAP COMPONENT ---
function LiveMap({myLocation, users, selectedUserId})
{
  const {nearIcon, farIcon}=useMemo(() =>
  {
    const createIcon=(url) => new L.Icon({
      iconUrl: url,
      iconSize: [32, 32],
      popupAnchor: [0, -16]
    });
    return {
      nearIcon: createIcon("https://cdn-icons-png.flaticon.com/512/447/447031.png"),
      farIcon: createIcon("https://cdn-icons-png.flaticon.com/512/252/252025.png")
    };
  }, []);

  const markerRefs=useRef({});

  useEffect(() =>
  {
    if (selectedUserId&&markerRefs.current[selectedUserId])
    {
      markerRefs.current[selectedUserId].openPopup();
    }
  }, [selectedUserId]);

  return (
    <MapContainer center={myLocation} zoom={16} style={{height: "100%", width: "100%"}}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Recenter myLocation={myLocation} />
      <Marker position={myLocation}>
        <Popup>My Location</Popup>
      </Marker>
      <Circle center={myLocation} radius={500} pathOptions={{color: "#d63384", fillColor: "#d63384", fillOpacity: 0.1}} />

      {Object.entries(users).map(([id, coords]) =>
      {
        const distance=getDistance(myLocation[0], myLocation[1], coords[0], coords[1]);
        const icon=distance<=500? nearIcon:farIcon;
        return (
          <Marker
            key={id}
            position={coords}
            icon={icon}
            ref={(el) => (markerRefs.current[id]=el)}
          >
            <Popup>User: {id} ({Math.round(distance)}m away)</Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}