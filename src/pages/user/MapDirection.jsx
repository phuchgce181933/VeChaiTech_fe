import { useEffect, useState, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  Polyline,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import PropTypes from "prop-types";

import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconShadowUrl from "leaflet/dist/images/marker-shadow.png";

/* ================= ICON ================= */
const defaultIcon = new L.Icon({
  iconUrl,
  shadowUrl: iconShadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

/* ================= CHANGE MAP VIEW ================= */
const ChangeMapView = ({ coords }) => {
  const map = useMap();

  useEffect(() => {
    if (coords) {
      map.setView(coords, 15, { animate: true });
    }
  }, [coords, map]);

  return null;
};

ChangeMapView.propTypes = {
  coords: PropTypes.array,
};

/* ================= MAIN ================= */
export default function MapDirection() {
  const [points, setPoints] = useState([]);
  const [selectedCoords, setSelectedCoords] = useState(null);
  const [currentCoords, setCurrentCoords] = useState(null);
  const [route, setRoute] = useState(null);
  const [loading, setLoading] = useState(true);

  const watchIdRef = useRef(null);
  const deniedRef = useRef(false);

  /* ===== FETCH POINTS ===== */
  useEffect(() => {
    fetch("http://localhost:8080/api/v1/recycler-demands")
      .then((res) => res.json())
      .then((data) => {
        setPoints(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  /* ===== CLEANUP GPS ===== */
  useEffect(() => {
    return () => {
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  /* ===== GET MY LOCATION ===== */
  const handleGetMyLocation = () => {
    if (!navigator.geolocation) {
      alert("Trình duyệt không hỗ trợ GPS");
      return;
    }

    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current);
    }

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        setCurrentCoords([pos.coords.latitude, pos.coords.longitude]);
        deniedRef.current = false;
      },
      (err) => {
        if (!deniedRef.current && err.code === 1) {
          alert("Bạn đã từ chối quyền GPS. Hãy bật lại trong trình duyệt.");
          deniedRef.current = true;
        }
      },
      { enableHighAccuracy: true }
    );
  };

  /* ===== CREATE ROUTE ===== */
  const handleCreateRoute = async (destination) => {
    if (!currentCoords) {
      alert("Vui lòng lấy vị trí của bạn trước.");
      return;
    }

    try {
      const apiKey = import.meta.env.VITE_ORS_KEY;

      const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${currentCoords[1]},${currentCoords[0]}&end=${destination[1]},${destination[0]}`;

      const res = await fetch(url);
      if (!res.ok) throw new Error("Route API failed");

      const data = await res.json();
      if (!data.features?.length) {
        alert("Không tìm được đường đi");
        return;
      }

      const coords = data.features[0].geometry.coordinates.map((c) => [
        c[1],
        c[0],
      ]);

      setRoute(coords);
    } catch (err) {
      console.error(err);
      alert("Không thể tạo đường đi.");
    }
  };

  /* ===== LOADING ===== */
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[560px] bg-[#F4FBF7]">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex gap-6 h-[560px]">
      {/* ================= SIDEBAR ================= */}
      <aside className="w-[320px] bg-white rounded-2xl shadow-lg p-4 flex flex-col">
        <h2 className="text-xl font-bold text-emerald-700 text-center mb-4">
          🗺️ Điểm thu gom
        </h2>

        <button
          onClick={handleGetMyLocation}
          className="mb-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition"
        >
          📍 Lấy vị trí của tôi
        </button>

        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {points.map((point) => {
            const coords = [
              parseFloat(point.latitude),
              parseFloat(point.longitude),
            ];

            const isActive =
              selectedCoords?.[0] === coords[0] &&
              selectedCoords?.[1] === coords[1];

            return (
              <div
                key={point.id}
                onClick={() => setSelectedCoords(coords)}
                className={`border rounded-xl p-3 cursor-pointer transition
                  ${
                    isActive
                      ? "bg-emerald-100 border-emerald-400"
                      : "bg-gray-50 hover:bg-emerald-50"
                  }
                `}
              >
                <h3 className="font-semibold text-emerald-700">
                  {point.name}
                </h3>

                <p className="text-sm text-gray-600 line-clamp-2">
                  {point.description}
                </p>

                <img
                  src={point.imageUrl}
                  alt={point.name}
                  className="mt-2 w-full h-28 object-cover rounded-lg"
                />

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCreateRoute(coords);
                  }}
                  className="mt-3 w-full py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium transition"
                >
                  🧭 Tạo đường đi
                </button>
              </div>
            );
          })}
        </div>
      </aside>

      {/* ================= MAP ================= */}
      <div className="flex-1 rounded-2xl overflow-hidden shadow-lg relative">
        <MapContainer
          center={[10.0299, 105.7706]}
          zoom={13}
          scrollWheelZoom
          className="w-full h-full"
        >
          <TileLayer
            attribution="&copy; OpenStreetMap"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {points.map((p) => (
            <Marker
              key={p.id}
              position={[
                parseFloat(p.latitude),
                parseFloat(p.longitude),
              ]}
              icon={defaultIcon}
            >
              <Popup>
                <strong>{p.name}</strong>
                <p className="text-sm">{p.description}</p>
                <img
                  src={p.imageUrl}
                  alt={p.name}
                  className="mt-2 rounded-md"
                  width={120}
                />
              </Popup>
            </Marker>
          ))}

          {currentCoords && (
            <Marker position={currentCoords} icon={defaultIcon}>
              <Popup>📍 Vị trí của bạn</Popup>
            </Marker>
          )}

          {route && (
            <Polyline positions={route} color="#10b981" weight={5} />
          )}

          {selectedCoords && <ChangeMapView coords={selectedCoords} />}
        </MapContainer>

        {/* LOGO */}
        <img
          src="https://res.cloudinary.com/dcg5wftdq/image/upload/v1760774533/xpknvzz5hfelc4c3qaqc.png"
          alt="Logo"
          className="absolute bottom-3 right-3 w-36 opacity-90 pointer-events-none"
        />
      </div>
    </div>
  );
}
