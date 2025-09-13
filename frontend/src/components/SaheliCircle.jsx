// This is the full code for your React component file (e.g., SaheliCirclePage.jsx)

import React, {useEffect, useState, useMemo, useRef} from "react";
import io from "socket.io-client";
import {MapContainer, TileLayer, Marker, Popup, Circle, useMap} from "react-leaflet";

// **CRITICAL FIX 1: IMPORT LEAFLET CSS**
// This line is essential for the map to render correctly.
import "leaflet/dist/leaflet.css";

import L from "leaflet";
import {PhoneIcon, ChatBubbleBottomCenterTextIcon, UserPlusIcon, MapPinIcon} from '@heroicons/react/24/solid';

// **CRITICAL FIX 2: MANUALLY SET MARKER ICONS**
// This ensures marker images are always found and displayed properly.
import markerIconUrl from "leaflet/dist/images/marker-icon.png";
import markerShadowUrl from "leaflet/dist/images/marker-shadow.png";

const defaultIcon=new L.Icon({
    iconUrl: markerIconUrl,
    shadowUrl: markerShadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});
// Apply this fix globally to all markers
L.Marker.prototype.options.icon=defaultIcon;


// --- SOCKET SETUP ---
// This connects to your server. Make sure the URL is correct.
const socket=io("http://localhost:3000", {
    auth: {token: localStorage.getItem("token")}
});

socket.on("connect_error", (error) =>
{
    if (error.message==="Authentication required")
    {
        console.error("Authentication Error: Please log in.");
    }
});


// --- HELPER FUNCTIONS ---
function getDistance(lat1, lon1, lat2, lon2)
{
    const R=6371e3;
    const toRad=(x) => (x*Math.PI)/180;
    const φ1=toRad(lat1);
    const φ2=toRad(lat2);
    const Δφ=toRad(lat2-lat1);
    const Δλ=toRad(lon2-lon1);
    const a=Math.sin(Δφ/2)**2+Math.cos(φ1)*Math.cos(φ2)*Math.sin(Δλ/2)**2;
    const c=2*Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R*c;
}


// --- RECENTER MAP COMPONENT ---
function RecenterMap({location})
{
    const map=useMap();
    useEffect(() =>
    {
        if (location)
        {
            // Set zoom to 15 if it's not already set
            map.setView(location, map.getZoom()||15, {animate: true, pan: {duration: 1}});
        }
    }, [location, map]);
    return null;
}


// --- MAIN COMPONENT ---
export default function SaheliCirclePage()
{
    const [users, setUsers]=useState({});
    const [myLocation, setMyLocation]=useState(null); // Start as null to show a loading state
    const [selectedUserId, setSelectedUserId]=useState(null);
    const markerRefs=useRef({});
    const lastUpdateTime=useRef(0); // For throttling
    const radius=500;
    const defaultCenter=[22.7196, 75.8577]; // Default to Indore, MP

    // --- GEOLOCATION EFFECT ---
    useEffect(() =>
    {
        if (!navigator.geolocation)
        {
            console.error("Geolocation is not supported by this browser.");
            setMyLocation(defaultCenter); // Fallback to a default location
            return;
        }

        const watchId=navigator.geolocation.watchPosition(
            ({coords}) =>
            {
                const now=Date.now();
                // BEST PRACTICE: Throttle updates to send only once every 5 seconds
                if (now-lastUpdateTime.current<5000)
                {
                    return;
                }
                lastUpdateTime.current=now;

                const newLocation=[22.725702, 75.873781];
                console.log(`📍 Location updated: ${newLocation}, Accuracy: ${coords.accuracy}m`);

                setMyLocation(newLocation);
                socket.emit("send-location", {latitude: coords.latitude, longitude: coords.longitude});
            },
            (err) =>
            {
                console.error(`Geolocation Error: ${err.message}`);
                // If an error occurs, set a default location so the map can still render
                if (!myLocation)
                {
                    setMyLocation(defaultCenter);
                }
            },
            {enableHighAccuracy: true, timeout: 10000, maximumAge: 0}
        );

        return () => navigator.geolocation.clearWatch(watchId);
    }, []); // Empty dependency array ensures this runs only once

    // --- SOCKET LISTENERS ---
    useEffect(() =>
    {
        socket.on("existing-users", (existingUsers) =>
        {
            setUsers(existingUsers);
        });

        socket.on("receive-location", (data) =>
        {
            if (data?.userId)
            {
                setUsers((prev) => ({...prev, [data.userId]: data}));
            }
        });

        socket.on("user-disconnected", (userId) =>
        {
            setUsers((prev) =>
            {
                const updated={...prev};
                delete updated[userId];
                return updated;
            });
            // Safely update selected user if they disconnect
            setSelectedUserId((prevSelectedId) => (prevSelectedId===userId? null:prevSelectedId));
        });

        return () =>
        {
            socket.off("existing-users");
            socket.off("receive-location");
            socket.off("user-disconnected");
        };
    }, []); // Empty dependency array for setting up listeners once

    // --- OPEN POPUP WHEN USER SELECTED ---
    useEffect(() =>
    {
        if (selectedUserId&&markerRefs.current[selectedUserId])
        {
            markerRefs.current[selectedUserId].openPopup();
        }
    }, [selectedUserId]);

    const sortedUsers=useMemo(() =>
    {
        if (!myLocation) return [];
        return Object.values(users)
            .filter(u => u?.userId&&u.userId!==socket.id&&u.latitude&&u.longitude)
            .map(u => ({...u, distance: 0}))
            .sort((a, b) => a.distance-b.distance);
    }, [users, myLocation]);

    const activities=[
        {icon: "✅", text: "Priya marked herself as safe.", time: "2m ago"},
        {icon: "🚗", text: "Anjali started a trip to Vijay Nagar.", time: "15m ago"},
        {icon: "🏠", text: "Riya has arrived home.", time: "45m ago"},
    ];

    // Show a loading screen until we get the user's first location
    if (!myLocation)
    {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-slate-100">
                <p className="text-lg text-slate-600">Acquiring your location...</p>
            </div>
        );
    }

    return (
        <div className="bg-slate-100 min-h-screen font-sans p-4 lg:p-6 text-slate-800 pt-20">
            {/* HEADER */}
            <header className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Saheli Circle</h1>
                    <p className="text-slate-500">Your trusted safety network, live from Indore.</p>
                </div>
                <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 bg-white text-slate-700 px-4 py-2 rounded-lg shadow-sm hover:bg-slate-50 transition">
                        <UserPlusIcon className="h-5 w-5 text-indigo-500" /> Invite
                    </button>
                    <div className="w-10 h-10 bg-indigo-500 rounded-full text-white flex items-center justify-center font-bold">A</div>
                </div>
            </header>

            {/* MAIN GRID */}
            <main className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6">

                {/* MEMBERS LIST */}
                <section className="md:col-span-1 xl:col-span-1 bg-white rounded-xl shadow-md h-full">
                    <div className="flex justify-between items-center p-4 border-b border-slate-200">
                        <h2 className="text-lg font-semibold">Circle Members ({sortedUsers.length})</h2>
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" title="Live"></div>
                    </div>
                    <ul className="divide-y divide-slate-200 max-h-[70vh] overflow-y-auto">
                        {sortedUsers.length>0? sortedUsers.map(user => (
                            <li key={user.userId}
                                className={`p-4 flex items-center justify-between cursor-pointer transition-colors duration-200 ${selectedUserId===user.userId? 'bg-indigo-50':'hover:bg-slate-50'}`}
                                onClick={() => setSelectedUserId(user.userId)}
                            >
                                <div className="flex items-center min-w-0">
                                    <div className={`w-2.5 h-2.5 rounded-full mr-3 flex-shrink-0 ${user.distance<=radius? 'bg-green-500':'bg-slate-400'}`}></div>
                                    <div className="truncate">
                                        <p className="font-semibold text-slate-900 truncate">{user.name||'Unknown User'}</p>
                                        <p className="text-sm text-slate-500">
                                            {Math.round(user.distance)} meters away
                                            <span className="ml-2 px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-xs">
                                                {user.userType==='Customer'? 'User':'Saheli'}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-2 flex-shrink-0 ml-2">
                                    <button className="text-slate-400 hover:text-indigo-500" title="Call"><PhoneIcon className="h-5 w-5" /></button>
                                    <button className="text-slate-400 hover:text-indigo-500" title="Message"><ChatBubbleBottomCenterTextIcon className="h-5 w-5" /></button>
                                </div>
                            </li>
                        )):(
                            <p className="p-4 text-center text-slate-500">Waiting for members to connect...</p>
                        )}
                    </ul>
                </section>

                {/* MAP & ACTIVITY */}
                <section className="md:col-span-2 xl:col-span-2 flex flex-col gap-6">
                    {/* **CRITICAL CONTAINER FOR MAP** This div must have a defined height (like h-96) for the map to show up. */}
                    <div className="bg-white rounded-xl shadow-md p-4 h-[60vh] md:h-[70vh] lg:h-[75vh]">
                        <h2 className="text-lg font-semibold mb-3 text-slate-900">Live Map View</h2>
                        <MapContainer center={myLocation} zoom={15} style={{height: "100%", width: "100%", borderRadius: '8px'}}>
                            <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" attribution='&copy; OpenStreetMap &copy; CARTO' />
                            <RecenterMap location={myLocation} />

                            <Marker position={myLocation}>
                                <Popup>📍 Me</Popup>
                            </Marker>
                            <Circle center={myLocation} radius={radius} pathOptions={{color: "#6366f1", weight: 2, fillColor: "#818cf8", fillOpacity: 0.2}} />

                            {Object.values(users)
                                .filter(u => u?.userId&&u.userId!==socket.id&&u.latitude&&u.longitude)
                                .map(user => (
                                    <Marker
                                        key={user.userId}
                                        position={[22.725702, 75.873781]}
                                        ref={el => (markerRefs.current[user.userId]=el)}
                                    >
                                        <Popup>
                                            <div className="font-sans">
                                                <p className="font-semibold">{user.name||'Unknown User'}</p>
                                                <p className="text-sm text-gray-600">{user.userType==='Customer'? 'User':'Saheli'}</p>
                                                <p className="text-sm text-gray-500">{Math.round(user.distance)}m away</p>
                                            </div>
                                        </Popup>
                                    </Marker>
                                ))}
                        </MapContainer>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-4">
                        <h2 className="text-lg font-semibold mb-3 text-slate-900">Activity Feed</h2>
                        <ul className="space-y-4">
                            {activities.map((activity, index) => (
                                <li key={index} className="flex items-start text-sm">
                                    <span className="text-xl mr-3 mt-1">{activity.icon}</span>
                                    <div>
                                        <p className="text-slate-800">{activity.text}</p>
                                        <p className="text-slate-400 text-xs">{activity.time}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>

                {/* EMERGENCY */}
                <section className="md:col-span-3 xl:col-span-1">
                    <div className="bg-white rounded-xl shadow-md p-4 flex flex-col gap-4">
                        <h2 className="text-lg font-semibold text-slate-900">Emergency Actions</h2>
                        <button className="w-full bg-red-600 text-white font-bold py-4 rounded-lg text-lg hover:bg-red-700 transition-all duration-200 shadow-red-500/30 shadow-lg flex items-center justify-center gap-2 animate-pulse hover:animate-none">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v6a.75.75 0 001.5 0V9zM12 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" clipRule="evenodd" />
                            </svg>
                            TRIGGER SOS
                        </button>
                        <button className="w-full bg-indigo-500 text-white font-semibold py-3 rounded-lg hover:bg-indigo-600 transition-colors flex items-center justify-center gap-2">
                            <MapPinIcon className="h-5 w-5" /> Share Live Location
                        </button>
                    </div>
                </section>
            </main>
        </div>
    );
}