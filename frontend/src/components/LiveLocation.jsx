import {useEffect, useState} from "react";
import axios from "axios";

function FreeLocationAxios()
{
    const [location, setLocation]=useState({city: "", state: "", country: ""});
    const [coords, setCoords]=useState({latitude: null, longitude: null});

    useEffect(() =>
    {
        if (navigator.geolocation)
        {
            const watcher=navigator.geolocation.watchPosition(
                (position) =>
                {
                    const {latitude, longitude}=position.coords;
                    setCoords({latitude, longitude});
                    fetchLocation(latitude, longitude);
                },
                (error) => console.error(error),
                {enableHighAccuracy: true}
            );

            return () => navigator.geolocation.clearWatch(watcher);
        } else
        {
            console.error("Geolocation not supported");
        }
    }, []);

    const fetchLocation=async (lat, lon) =>
    {
        try
        {
            const response=await axios.get("https://nominatim.openstreetmap.org/reverse", {
                params: {
                    lat: lat,
                    lon: lon,
                    format: "json"
                },
                headers: {
                    "User-Agent": "YourAppName/1.0" // Required by Nominatim
                }
            });

            const address=response.data.address;
            setLocation({
                city: address.city||address.town||address.village||"",
                state: address.state||"",
                country: address.country||""
            });
        } catch (error)
        {
            console.error("Error fetching location:", error);
        }
    };

    return (
        <div>
            <h2>Your Location</h2>
            <p>Latitude: {coords.latitude}</p>
            <p>Longitude: {coords.longitude}</p>
            <p>City: {location.city}</p>
            <p>State: {location.state}</p>
            <p>Country: {location.country}</p>
        </div>
    );
}

export default FreeLocationAxios;
