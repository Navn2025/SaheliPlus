import axios from "axios";

function PoliceLocator()
{



    // --- Fetch nearby police from Overpass API ---
    async function fetchNearbyPoliceOverpass(lat, lng, radius)
    {
        const query=`
      [out:json][timeout:25];
      (
        node(around:${radius},${lat},${lng})[amenity=police];
        way(around:${radius},${lat},${lng})[amenity=police];
        relation(around:${radius},${lat},${lng})[amenity=police];
      );
      out center;
    `;

        const url="https://overpass-api.de/api/interpreter";

        const {data}=await axios.post(url, `data=${encodeURIComponent(query)}`, {
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
        });

        function toRad(deg)
        {
            return (deg*Math.PI)/180;
        }
        function distanceMeters(lat1, lon1, lat2, lon2)
        {
            const R=6371000;
            const dLat=toRad(lat2-lat1);
            const dLon=toRad(lon2-lon1);
            const a=
                Math.sin(dLat/2)**2+
                Math.cos(toRad(lat1))*
                Math.cos(toRad(lat2))*
                Math.sin(dLon/2)**2;
            return R*2*Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        }

        const list=(data.elements||[])
            .map((el) =>
            {
                const name=
                    (el.tags&&(el.tags.name||el.tags["addr:full"]))||
                    "Police Station";
                const latLng=
                    el.type==="node"
                        ? {lat: el.lat, lng: el.lon}
                        :el.center
                            ? {lat: el.center.lat, lng: el.center.lon}
                            :null;
                return latLng
                    ? {
                        name,
                        lat: latLng.lat,
                        lng: latLng.lng,
                        distance: distanceMeters(lat, lng, latLng.lat, latLng.lng),
                    }
                    :null;
            })
            .filter(Boolean);

        return list.sort((a, b) => a.distance-b.distance);
    }

    // --- Button handler ---
    const handleFindPolice=async () =>
    {
        try
        {
            const pos=await new Promise((resolve, reject) =>
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                    enableHighAccuracy: true,
                })
            );

            const {latitude, longitude}=pos.coords;
            const stations=await fetchNearbyPoliceOverpass(
                latitude,
                longitude,
                5000
            );

            if (stations.length===0)
            {
                alert("No nearby police stations found.");
            } else
            {
                const nearest=stations[0];
                const text=`Nearest Police: ${nearest.name}\nDistance: ${Math.round(
                    nearest.distance
                )} meters`;

                if (window.confirm(text+"\nOpen directions?"))
                {
                    window.open(
                        `https://www.google.com/maps/dir/?api=1&destination=${nearest.lat},${nearest.lng}`,
                        "_blank"
                    );
                }
            }
        } catch (err)
        {
            console.error("Error:", err);
            alert("Failed to fetch nearby police stations.");
        }
    };

    return (
        <div>
            <button
                onClick={handleFindPolice}
                style={{
                    padding: "10px 24px",
                    backgroundColor: "#ec4899",

                    color: "white",
                    border: "none",
                    borderRadius: "50px",
                    cursor: "pointer",
                    fontSize: "16px",
                    zIndex: 10,
                }}
            >
                Find Nearest Police Station
            </button>
        </div>
    );
}

export default PoliceLocator;
