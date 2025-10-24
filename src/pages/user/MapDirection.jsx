import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import PropTypes from "prop-types";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconShadowUrl from "leaflet/dist/images/marker-shadow.png";

// Icon mặc định
const defaultIcon = new L.Icon({
  iconUrl,
  shadowUrl: iconShadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// Component thay đổi góc nhìn bản đồ
const ChangeMapView = ({ coords }) => {
  const map = useMap();
  useEffect(() => {
    if (coords) map.setView(coords, 15, { animate: true });
  }, [coords]);
  return null;
};
ChangeMapView.propTypes = { coords: PropTypes.array };

const MapDirection = () => {
  const [points, setPoints] = useState([]);
  const [selectedCoords, setSelectedCoords] = useState(null);
  const [currentCoords, setCurrentCoords] = useState(null);
  const [route, setRoute] = useState(null);
  const [loading, setLoading] = useState(true);
  const watchIdRef = useRef(null);
  const deniedRef = useRef(false);

  // Fetch dữ liệu điểm thu gom
  useEffect(() => {
    fetch("http://localhost:8080/api/v1/recycler-demands")
      .then((res) => res.json())
      .then((data) => {
        setPoints(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi tải dữ liệu:", err);
        setLoading(false);
      });
  }, []);

  // Lấy vị trí người dùng
  const handleGetMyLocation = () => {
    if (!navigator.geolocation) {
      alert("Trình duyệt của bạn không hỗ trợ định vị.");
      return;
    }

    alert("Đang bật định vị và theo dõi vị trí...");

    if (watchIdRef.current) navigator.geolocation.clearWatch(watchIdRef.current);

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setCurrentCoords([latitude, longitude]);
        deniedRef.current = false;
      },
      (err) => {
        if (!deniedRef.current) {
          if (err.code === 1) {
            alert("Bạn đã từ chối quyền truy cập vị trí. Hãy bật lại trong cài đặt trình duyệt.");
            deniedRef.current = true;
          } else alert("Không thể lấy vị trí. Kiểm tra GPS hoặc mạng.");
        }
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
    );

    return () => navigator.geolocation.clearWatch(watchIdRef.current);
  };

  // Tạo tuyến đường
  const handleCreateRoute = async (destination) => {
    if (!currentCoords) {
      alert("Vui lòng bật GPS trước (nhấn 'Lấy vị trí của tôi').");
      return;
    }

    try {
      const apiKey =
        "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjYyNWY1ZmVhZGIxMzRkYWJhODljM2Q0MTRiN2EwN2MzIiwiaCI6Im11cm11cjY0In0=";
      const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${currentCoords[1]},${currentCoords[0]}&end=${destination[1]},${destination[0]}`;
      const res = await fetch(url);
      const data = await res.json();
      if (!data.features) throw new Error("API không trả về tuyến đường hợp lệ.");
      const coords = data.features[0].geometry.coordinates.map((c) => [c[1], c[0]]);
      setRoute(coords);
    } catch (err) {
      console.error("Lỗi khi tạo đường đi:", err);
      alert("Không thể tạo đường đi. Kiểm tra lại API key hoặc kết nối mạng.");
    }
  };

  if (loading) return <p>Đang tải bản đồ...</p>;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        gap: "16px",
        width: "100%",
        height: "550px",
        padding: "10px",
        boxSizing: "border-box",
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          width: "30%",
          minWidth: "280px",
          background: "#fff",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          overflowY: "auto",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h2 style={{ textAlign: "center", color: "#1d4ed8", marginBottom: "10px" }}>
          🗺️ Điểm thu gom
        </h2>

        <button
          onClick={handleGetMyLocation}
          style={{
            background: "#1d4ed8",
            color: "white",
            padding: "10px",
            border: "none",
            borderRadius: "8px",
            marginBottom: "16px",
            cursor: "pointer",
            fontWeight: "600",
            transition: "0.2s",
          }}
          onMouseOver={(e) => (e.target.style.background = "#2563eb")}
          onMouseOut={(e) => (e.target.style.background = "#1d4ed8")}
        >
          📍 Lấy vị trí của tôi
        </button>

        {points.length === 0 && <p>Không có dữ liệu điểm thu gom.</p>}

        {points.map((point) => (
          <div
            key={point.id}
            onClick={() =>
              setSelectedCoords([parseFloat(point.latitude), parseFloat(point.longitude)])
            }
            style={{
              cursor: "pointer",
              background: "#f9fafb",
              borderRadius: "10px",
              padding: "12px",
              marginBottom: "10px",
              border: "1px solid #e5e7eb",
              transition: "0.2s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = "#eff6ff")}
            onMouseOut={(e) => (e.currentTarget.style.background = "#f9fafb")}
          >
            <b style={{ fontSize: "16px", color: "#111827" }}>{point.name}</b>
            <p style={{ fontSize: "14px", color: "#374151" }}>{point.description}</p>
            <img
              src={point.imageUrl}
              alt={point.name}
              style={{
                width: "100%",
                borderRadius: "8px",
                objectFit: "cover",
                height: "140px",
              }}
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCreateRoute([parseFloat(point.latitude), parseFloat(point.longitude)]);
              }}
              style={{
                marginTop: "8px",
                background: "#16a34a",
                color: "white",
                border: "none",
                borderRadius: "8px",
                padding: "8px 10px",
                cursor: "pointer",
                width: "100%",
                fontWeight: "500",
                transition: "0.2s",
              }}
              onMouseOver={(e) => (e.target.style.background = "#15803d")}
              onMouseOut={(e) => (e.target.style.background = "#16a34a")}
            >
              🧭 Tạo đường đi
            </button>
          </div>
        ))}
      </div>

      {/* Bản đồ */}
      <div
        style={{
          flex: 1,
          height: "100%",
          borderRadius: "12px",
          overflow: "hidden",
          position: "relative",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <MapContainer
          center={[10.0299, 105.7706]}
          zoom={13}
          scrollWheelZoom
          style={{ width: "100%", height: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {points.map((p) => (
            <Marker
              key={p.id}
              position={[parseFloat(p.latitude), parseFloat(p.longitude)]}
              icon={defaultIcon}
            >
              <Popup>
                <b>{p.name}</b>
                <br />
                {p.description}
                <br />
                <img
                  src={p.imageUrl}
                  alt={p.name}
                  width="100"
                  style={{ borderRadius: "6px", marginTop: "5px" }}
                />
              </Popup>
            </Marker>
          ))}

          {currentCoords && (
            <Marker position={currentCoords} icon={defaultIcon}>
              <Popup>📍 Vị trí của bạn</Popup>
            </Marker>
          )}

          {route && <Polyline positions={route} color="#2563eb" weight={5} />}

          {selectedCoords && <ChangeMapView coords={selectedCoords} />}
        </MapContainer>

        {/* Banner logo che attribution */}
        <img
          src="https://res.cloudinary.com/dcg5wftdq/image/upload/v1760774533/xpknvzz5hfelc4c3qaqc.png"
          alt="Banner"
          style={{
            position: "absolute",
            bottom: "0",
            right: "0",
            width: "180px",
            height: "130px",
            zIndex: 1000,
            pointerEvents: "none",
          }}
        />
      </div>
    </div>
  );
};

export default MapDirection;
