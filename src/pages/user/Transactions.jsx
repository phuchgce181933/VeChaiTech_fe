import { useState, useRef, useEffect } from "react";
import "./css/Transactions.css";
export default function CurrentLocation() {
  const [coords, setCoords] = useState(null);
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const watchIdRef = useRef(null);

  useEffect(() => {
    return () => {
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("Trình duyệt không hỗ trợ GPS");
      return;
    }

    setLoading(true);

    watchIdRef.current = navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const latitude = pos.coords.latitude;
        const longitude = pos.coords.longitude;

        setCoords({ latitude, longitude });

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
          );

          const data = await res.json();
          setAddress(data.display_name || "Không xác định được địa chỉ");
        } catch (err) {
          setAddress("Lỗi khi lấy địa chỉ");
        } finally {
          setLoading(false);
        }
      },
      () => {
        alert("Không thể lấy vị trí. Hãy kiểm tra quyền GPS.");
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
      }
    );
  };

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-white to-emerald-50">
      <div className="max-w-lg mx-auto">

        <div className="eco-card">

          <div className="eco-header">
            <div className="eco-icon">🌿</div>
            <h2>Vị trí hiện tại của bạn</h2>
          </div>

          <button
            onClick={handleGetLocation}
            disabled={loading}
            className={`eco-btn ${loading ? "disabled" : ""}`}
          >
            {loading ? "Đang xác định vị trí..." : "Lấy vị trí của tôi"}
          </button>

          {coords && (
            <div className="eco-result">
              <div className="eco-line">
                <span>Latitude</span>
                <strong>{coords.latitude}</strong>
              </div>

              <div className="eco-line">
                <span>Longitude</span>
                <strong>{coords.longitude}</strong>
              </div>

              {address && (
                <div className="eco-address">
                  {address}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </section>
  );
}