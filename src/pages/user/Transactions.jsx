import { useState, useRef, useEffect } from "react";

export default function CurrentLocation() {
  const [coords, setCoords] = useState(null);
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const watchIdRef = useRef(null);

  /* ===== CLEANUP GPS ===== */
  useEffect(() => {
    return () => {
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  /* ===== GET CURRENT LOCATION ===== */
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
          setAddress(
            data.display_name || "Không xác định được địa chỉ"
          );
        } catch (err) {
          console.error(err);
          setAddress("Lỗi khi lấy địa chỉ");
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        console.error(err);
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
    <div className="max-w-md mx-auto p-6 bg-white rounded-2xl shadow">
      <h2 className="text-xl font-bold text-emerald-700 mb-4">
        📍 Vị trí hiện tại
      </h2>

      <button
        onClick={handleGetLocation}
        disabled={loading}
        className={`w-full py-3 rounded-xl font-semibold text-white transition
          ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-emerald-600 hover:bg-emerald-700"
          }
        `}
      >
        {loading ? "Đang lấy vị trí..." : "Lấy vị trí của tôi"}
      </button>

      {coords && (
        <div className="mt-4 text-sm text-gray-700 space-y-2">
          <p>
            <strong>Latitude:</strong> {coords.latitude}
          </p>
          <p>
            <strong>Longitude:</strong> {coords.longitude}
          </p>

          {address && (
            <p>
              <strong>Địa chỉ:</strong>{" "}
              <span className="text-gray-600">
                {address}
              </span>
            </p>
          )}
        </div>
      )}
    </div>
  );
}
