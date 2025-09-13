import React, {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import axios from "../api/ApiConfigure";
import {MapContainer, TileLayer, Marker, Popup, useMapEvents} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Leaflet icons
const safeIcon=new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/190/190411.png",
    iconSize: [35, 45],
    iconAnchor: [17, 45],
});

const unsafeIcon=new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/190/190406.png",
    iconSize: [35, 45],
    iconAnchor: [17, 45],
});

// Component for draggable marker to set form lat/lng
function DraggableMarker({position, setPosition})
{
    const [markerPosition, setMarkerPosition]=useState(position);

    const map=useMapEvents({
        click(e)
        {
            setMarkerPosition([e.latlng.lat, e.latlng.lng]);
            setPosition([e.latlng.lat, e.latlng.lng]);
        },
    });

    const eventHandlers={
        dragend(e)
        {
            const latlng=e.target.getLatLng();
            setMarkerPosition([latlng.lat, latlng.lng]);
            setPosition([latlng.lat, latlng.lng]);
        },
    };

    return (
        <Marker
            position={markerPosition}
            draggable={true}
            eventHandlers={eventHandlers}
            icon={safeIcon} // Default icon, can switch based on form later
        />
    );
}

export default function SafetyDashboard()
{
    const [locations, setLocations]=useState([]);
    const {register, handleSubmit, reset, setValue, watch}=useForm();
    const [markerPos, setMarkerPos]=useState([22.7196, 75.8577]); // default position

    const watchRating=watch("rating"); // to dynamically change icon if needed

    // Fetch existing locations
    useEffect(() =>
    {
        const fetchLocations=async () =>
        {
            try
            {
                const res=await axios.get("/api/safety-locations/getlocation");
                setLocations(Array.isArray(res.data)? res.data:[]);
            } catch (err)
            {
                console.error("Error fetching locations:", err);
            }
        };
        fetchLocations();
    }, []);

    // Update form lat/lng whenever marker moves
    useEffect(() =>
    {
        setValue("lat", markerPos[0]);
        setValue("lng", markerPos[1]);
    }, [markerPos, setValue]);

    // Submit new location
    const onSubmit=async (formData) =>
    {
        try
        {
            const newLoc={
                lat: parseFloat(formData.lat),
                lng: parseFloat(formData.lng),
                rating: formData.rating,
                comment: formData.comment||"",
            };
            const {data: savedLoc}=await axios.post(
                "/api/safety-locations/postlocation",
                newLoc
            );
            setLocations((prev) => [...prev, savedLoc]);
            reset();
            setMarkerPos([22.7196, 75.8577]); // reset marker to default
        } catch (err)
        {
            console.error("Error posting location:", err);
        }
    };

    return (
        <div className="p-4 md:p-8 mt-20 grid gap-6 md:grid-cols-2">
            {/* Form */}
            <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col h-fit">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Submit a Location</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <input
                        type="number"
                        step="0.000001"
                        placeholder="Latitude"
                        {...register("lat", {required: true})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-400 focus:outline-none"
                        readOnly
                    />
                    <input
                        type="number"
                        step="0.000001"
                        placeholder="Longitude"
                        {...register("lng", {required: true})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-400 focus:outline-none"
                        readOnly
                    />
                    <select
                        {...register("rating", {required: true})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-400 focus:outline-none"
                    >
                        <option value="">Select Rating</option>
                        <option value="Safe">Safe</option>
                        <option value="Unsafe">Unsafe</option>
                    </select>
                    <textarea
                        placeholder="Comment (optional)"
                        {...register("comment")}
                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-400 focus:outline-none resize-none"
                    />
                    <button
                        type="submit"
                        className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-xl font-semibold transition-all"
                    >
                        Submit
                    </button>
                </form>
            </div>

            {/* Map */}
            <div className="bg-white rounded-2xl shadow-lg p-4">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Safety Map</h2>
                <MapContainer
                    center={markerPos}
                    zoom={13}
                    style={{height: "550px", width: "100%", borderRadius: "1rem"}}
                >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                    {/* Draggable marker for new location */}
                    <DraggableMarker position={markerPos} setPosition={setMarkerPos} />

                    {/* Existing locations */}
                    {locations.map((loc) => (
                        <Marker
                            key={loc._id}
                            position={[parseFloat(loc.lat), parseFloat(loc.lng)]}
                            icon={loc.rating==="Safe"? safeIcon:unsafeIcon}
                        >
                            <Popup>
                                <b>{loc.rating}</b>
                                <p>{loc.comment}</p>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>
        </div>
    );
}
