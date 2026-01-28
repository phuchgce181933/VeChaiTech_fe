import { useEffect, useState, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";

/* ================= ICON ================= */
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconShadowUrl from "leaflet/dist/images/marker-shadow.png";

const defaultIcon = new L.Icon({
  iconUrl,
  shadowUrl: iconShadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

/* ================= UTILS ================= */
const haversine = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) ** 2;
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
};

/* ================= MAP FIX ================= */
const FixMapResize = () => {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => map.invalidateSize(), 300);
  }, [map]);
  return null;
};

/* ================= MAIN ================= */
export default function MapDirection() {
  const API_BASE = import.meta.env.VITE_API_BASE_URL;
  const ORS_KEY = import.meta.env.VITE_ORS_KEY;

  const [points, setPoints] = useState([]);
  const [currentCoords, setCurrentCoords] = useState(null);
  const [route, setRoute] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(true);

  const watchIdRef = useRef(null);

  /* ===== DETECT MOBILE ===== */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  /* ===== FETCH POINTS ===== */
  useEffect(() => {
    axios
      .get(`${API_BASE}/api/v1/recycler-demands`, {
        headers: {
          Accept: "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      })
      .then((res) => {
        const raw = Array.isArray(res.data)
          ? res.data
          : res.data?.data || [];
        setPoints(
          raw.filter((p) => p.latitude && p.longitude)
        );
      })
      .finally(() => setLoading(false));
  }, [API_BASE]);

  /* ===== GET MY LOCATION ===== */
  const handleGetMyLocation = () => {
    if (!navigator.geolocation) {
      alert("Trình duyệt không hỗ trợ GPS");
      return;
    }

    watchIdRef.current &&
      navigator.geolocation.clearWatch(watchIdRef.current);

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        setCurrentCoords([
          pos.coords.latitude,
          pos.coords.longitude,
        ]);
      },
      () => alert("Không lấy được vị trí"),
      { enableHighAccuracy: true }
    );
  };

  /* ===== CREATE ROUTE (DESKTOP) ===== */
  const handleCreateRoute = async (dest) => {
    if (!currentCoords) {
      alert("Vui lòng lấy vị trí của bạn");
      return;
    }

    const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${ORS_KEY}&start=${currentCoords[1]},${currentCoords[0]}&end=${dest[1]},${dest[0]}`;

    const res = await axios.get(url);
    const coords =
      res.data.features[0].geometry.coordinates.map(
        ([lng, lat]) => [lat, lng]
      );
    setRoute(coords);
  };

  /* ===== OPEN GOOGLE MAPS (MOBILE) ===== */
  const openGoogleMaps = (lat, lng) => {
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
      "_blank"
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  /* ================= MOBILE ================= */
  if (isMobile) {
    return (
      <div className="px-4 py-4 space-y-4">
        {/* BUTTON GET LOCATION */}
        <button
          onClick={handleGetMyLocation}
          className="w-full py-3 rounded-xl bg-emerald-600 text-white font-semibold"
        >
          📍 Lấy vị trí của tôi
        </button>

        {/* HORIZONTAL SCROLL */}
        <div
          className="
          flex gap-4 overflow-x-auto
          pb-4 -mx-4 px-4
          snap-x snap-mandatory
          scrollbar-hide
        "
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {points.map((p) => {
            const distance =
              currentCoords &&
              haversine(
                currentCoords[0],
                currentCoords[1],
                p.latitude,
                p.longitude
              ).toFixed(2);

            return (
              <div
                key={p.id}
                className="
                min-w-[85%]
                snap-start
                border rounded-2xl p-4
                bg-white shadow
                flex-shrink-0
              "
              >
                <h3 className="font-bold text-emerald-700">
                  {p.name}
                </h3>

                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {p.description}
                </p>

                {distance && (
                  <p className="mt-2 text-sm">
                    📏 Cách bạn <b>{distance} km</b>
                  </p>
                )}

                <button
                  onClick={() =>
                    openGoogleMaps(p.latitude, p.longitude)
                  }
                  className="mt-4 w-full py-2 rounded-lg bg-emerald-500 text-white"
                >
                  🧭 Mở Google Maps
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  }


  /* ================= DESKTOP ================= */
  return (
    <div className="flex gap-6 h-[560px]">
      {/* SIDEBAR */}
      <aside className="w-[320px] bg-white rounded-2xl shadow-lg p-4 flex flex-col">
        <button
          onClick={handleGetMyLocation}
          className="mb-4 w-full py-2 rounded-xl bg-emerald-600 text-white font-semibold"
        >
          📍 Lấy vị trí của tôi
        </button>

        <div className="space-y-3 overflow-y-auto flex-1">
          {points.map((p) => {
            const coords = [p.latitude, p.longitude];
            const distance =
              currentCoords &&
              haversine(
                currentCoords[0],
                currentCoords[1],
                p.latitude,
                p.longitude
              ).toFixed(2);

            return (
              <div
                key={p.id}
                className="border rounded-xl p-3 hover:bg-emerald-50"
              >
                <h3 className="font-semibold text-emerald-700">
                  {p.name}
                </h3>

                {distance && (
                  <p className="text-sm">
                    📏 {distance} km
                  </p>
                )}

                <button
                  onClick={() => handleCreateRoute(coords)}
                  className="mt-2 w-full py-1 rounded bg-emerald-500 text-white"
                >
                  🧭 Tạo đường đi
                </button>
              </div>
            );
          })}
        </div>
      </aside>

      {/* MAP */}
      <div className="flex-1 rounded-2xl overflow-hidden shadow-lg">
        <MapContainer
          center={[10.0299, 105.7706]}
          zoom={13}
          className="w-full h-full"
        >
          <FixMapResize />

          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap"
          />

          {points.map((p) => (
            <Marker
              key={p.id}
              position={[p.latitude, p.longitude]}
              icon={defaultIcon}
            >
              <Popup>{p.name}</Popup>
            </Marker>
          ))}

          {currentCoords && (
            <Marker position={currentCoords} icon={defaultIcon}>
              <Popup>📍 Bạn đang ở đây</Popup>
            </Marker>
          )}

          {route.length > 0 && (
            <Polyline
              positions={route}
              color="#10b981"
              weight={5}
            />
          )}
        </MapContainer>
      </div>
    </div>
  );
}
