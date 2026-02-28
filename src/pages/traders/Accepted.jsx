import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import L from "leaflet";
import { useRef } from "react";
export default function TradersAccepted() {
  const { user } = useContext(AuthContext);
  const token = user?.token;

  const [orders, setOrders] = useState([]);
  const [adminLocation, setAdminLocation] = useState(null);

  const API_BASE = import.meta.env.VITE_API_BASE_URL;
  const [showMapModal, setShowMapModal] = useState(false);
  const [mapData, setMapData] = useState(null);
  // ===== CANCEL STATES =====
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelFile, setCancelFile] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);
  const mapRef = useRef(null);
  /* ===================== MAP ===================== */
  useEffect(() => {
    if (!showMapModal || !mapData) return;

    let intervalId;
    let routeLayer;
    let userMarker;

    const map = L.map("vechai-map").setView(
      [mapData.originLat, mapData.originLng],
      17
    );

    mapRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    userMarker = L.marker([mapData.originLat, mapData.originLng]).addTo(map);

    const destLat = mapData.destLat;
    const destLng = mapData.destLng;

    L.marker([destLat, destLng])
      .addTo(map)
      .bindPopup("📍 Điểm đến");

    // ===== REALTIME NAVIGATION =====
    const updateRoute = async (currentLat, currentLng) => {
      try {
        const res = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${currentLng},${currentLat};${destLng},${destLat}?overview=full&geometries=geojson`
        );

        const data = await res.json();
        if (!data.routes?.length) return;

        const route = data.routes[0];
        const geometry = route.geometry;
        const distanceKm = (route.distance / 1000).toFixed(2);
        const durationMin = Math.ceil(route.duration / 60);

        // Update ETA + Distance lên UI
        setMapData((prev) => ({
          ...prev,
          routeDistance: distanceKm,
          eta: durationMin,
        }));

        if (!routeLayer) {
          routeLayer = L.geoJSON(geometry, {
            style: { color: "green", weight: 6 },
          }).addTo(map);
        } else {
          routeLayer.clearLayers();
          routeLayer.addData(geometry);
        }

        map.fitBounds(routeLayer.getBounds());
      } catch (err) {
        console.log("Route error:", err);
      }
    };

    // Watch GPS
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        userMarker.setLatLng([lat, lng]);

        // Follow camera
        map.setView([lat, lng]);

        updateRoute(lat, lng);
      },
      (err) => console.log("GPS error:", err),
      { enableHighAccuracy: true }
    );

    // Update mỗi 2s để giống Grab
    intervalId = setInterval(() => {
      if (!adminLocation) return;
      updateRoute(adminLocation.latitude, adminLocation.longitude);
    }, 2000);

    return () => {
      navigator.geolocation.clearWatch(watchId);
      clearInterval(intervalId);
      map.remove();
    };
  }, [showMapModal, mapData?.destLat]);
  /* ===================== GEO REALTIME ===================== */
  useEffect(() => {
    if (!navigator.geolocation) {
      console.log("❌ Browser không hỗ trợ GPS");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const location = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        };

        console.log("📍 Admin current location:", location);
        setAdminLocation(location);
      },
      (err) => console.log("❌ GPS error:", err),
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  /* ===================== FETCH ORDERS ===================== */
  useEffect(() => {
    if (!user?.id || !token) return;

    const fetchOrders = async () => {
      try {
        const listRes = await axios.get(
          `${API_BASE}/api/v1/orders/recycler/${user.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const claimedOrders = (listRes.data.data || []).filter(
          (o) => o.status === "CLAIMED"
        );

        const detailRequests = claimedOrders.map((o) =>
          axios.get(`${API_BASE}/api/v1/orders/${o.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
        );

        const detailResponses = await Promise.all(detailRequests);
        const fullOrders = detailResponses.map((res) => res.data.data);

        console.log("📦 Orders loaded:", fullOrders);

        setOrders(fullOrders);
      } catch (err) {
        console.error("❌ Fetch orders error:", err);
      }
    };

    fetchOrders();
  }, [user, token]);

  /* ===================== DISTANCE ===================== */
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
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

  const getDistanceInfo = (order) => {
    if (!adminLocation || !order.latitude || !order.longitude) return null;

    const lat = Number(order.latitude);
    const lng = Number(order.longitude);

    console.log("------ DEBUG ORDER ------");
    console.log("Admin:", adminLocation);
    console.log("Order:", lat, lng);

    const d = calculateDistance(
      adminLocation.latitude,
      adminLocation.longitude,
      lat,
      lng
    );

    console.log("📏 Distance (km):", d);

    return { distance: d.toFixed(2), warning: d > 10 };
  };

  /* ===================== ACTIONS ===================== */

  const openCancelModal = (orderId) => {
    setSelectedOrderId(orderId);
    setCancelReason("");
    setCancelFile(null);
    setShowCancelModal(true);
  };

  const cancelOrder = async () => {
    if (!cancelReason || !cancelFile) {
      alert("Vui lòng nhập lý do và chọn ảnh/video");
      return;
    }

    try {
      setCancelLoading(true);

      const formData = new FormData();
      formData.append("file", cancelFile);
      formData.append("reason", cancelReason);
      formData.append("userId", user.id);

      await axios.post(
        `${API_BASE}/api/v1/orders/${selectedOrderId}/cancel`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setOrders((prev) => prev.filter((o) => o.id !== selectedOrderId));
      setShowCancelModal(false);
    } catch {
      alert("Hủy đơn thất bại");
    } finally {
      setCancelLoading(false);
    }
  };

  const completeOrder = async (orderId) => {
    try {
      await axios.patch(
        `${API_BASE}/api/v1/orders/${orderId}/status?status=COMPLETED`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setOrders((prev) => prev.filter((o) => o.id !== orderId));
    } catch {
      alert("Hoàn thành thất bại");
    }
  };
  const openVechaiMap = (order) => {
    if (!adminLocation || !order.latitude || !order.longitude) return;

    setMapData({
      originLat: adminLocation.latitude,
      originLng: adminLocation.longitude,
      destLat: Number(order.latitude),
      destLng: Number(order.longitude),
    });

    setShowMapModal(true);
  };
  /* ===================== UI ===================== */

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-green-700">
        ♻️ Đơn hàng đã nhận
      </h1>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 text-center shadow">
          📭 Không có đơn đang xử lý
        </div>
      ) : (
        <div className="space-y-5">
          {orders.map((order) => {
            const d = getDistanceInfo(order);

            const openMap = () => {
              if (!adminLocation || !order.latitude || !order.longitude)
                return;

              const origin = `${adminLocation.latitude},${adminLocation.longitude}`;
              const destination = `${order.latitude},${order.longitude}`;

              console.log("🧭 Open map from:", origin);
              console.log("🧭 To:", destination);

              const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}`;
              window.open(url, "_blank");
            };

            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-green-100 shadow-sm p-6 relative"
              >
                <div className="absolute left-0 top-0 h-full w-1 bg-green-600 rounded-l-2xl" />

                <div className="flex justify-between items-center mb-4">
                  <p className="font-semibold text-green-800">
                    Đơn #{order.id}
                  </p>

                  <span className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-700">
                    CLAIMED
                  </span>
                </div>

                {d && (
                  <div className="text-sm mb-2">
                    📍 Khoảng cách:{" "}
                    <b className="text-green-700">{d.distance} km</b>
                  </div>
                )}

                {d?.warning && (
                  <div className="bg-orange-50 border border-orange-300 text-orange-800 rounded-xl p-4 mb-4 text-sm">
                    ⚠️ <b>Cảnh báo:</b> Đơn hàng cách bạn hơn 10km.
                  </div>
                )}

                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400 text-xs">Khách hàng</p>
                    <p className="font-medium">{order.customerName}</p>
                  </div>

                  <div>
                    <p className="text-gray-400 text-xs">Số điện thoại</p>
                    <a
                      href={`tel:${order.customerPhone}`}
                      className="text-green-600 font-semibold"
                    >
                      {order.customerPhone}
                    </a>
                  </div>

                  <div>
                    <p className="text-gray-400 text-xs">Loại rác</p>
                    <p className="font-medium">{order.wasteListingName}</p>
                  </div>
                </div>

                <div className="mt-4 bg-green-50 border border-green-100 rounded-xl p-4">
                  <p className="text-xs text-gray-500 mb-1">
                    📍 Địa chỉ chi tiết
                  </p>
                  <p className="font-semibold text-green-800">
                    {order.addressFull}
                  </p>
                </div>

                <div className="grid md:flex gap-3 mt-6">
                  <button
                    onClick={openMap}
                    className="w-full md:w-auto px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition"
                  >
                    🧭 Dẫn đường
                  </button>

                  <button
                    onClick={() => completeOrder(order.id)}
                    className="w-full md:w-auto px-4 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white transition"
                  >
                    ✔️ Hoàn thành
                  </button>

                  <button
                    onClick={() => openCancelModal(order.id)}
                    className="w-full md:w-auto px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white transition"
                  >
                    ❌ Hủy
                  </button>

                  <button
                    onClick={() => openVechaiMap(order)}
                    className="w-full md:w-auto px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition"
                  >
                    Hệ thống dẫn đường VechaiTech (đang thử nghiệm)
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showCancelModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-red-600 mb-4">
              Hủy đơn hàng
            </h2>

            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="w-full border rounded-xl p-3 mb-3"
              placeholder="Nhập lý do hủy..."
            />

            <input
              type="file"
              accept="image/*,video/*"
              onChange={(e) => setCancelFile(e.target.files[0])}
            />

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg"
              >
                Đóng
              </button>

              <button
                onClick={cancelOrder}
                disabled={cancelLoading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg"
              >
                {cancelLoading ? "Đang hủy..." : "Xác nhận"}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ================= MAP MODAL ================= */}
      {/* ================= MAP MODAL ================= */}
      {showMapModal && mapData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">

          <div
            className="
        bg-white relative shadow-lg
        w-full h-full
        md:w-[900px] md:h-[600px] md:rounded-2xl
      "
          >
            {/* Close Button */}
            <button
              onClick={() => setShowMapModal(false)}
              className="absolute top-3 right-3 z-10 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
            >
              ✕ Đóng
            </button>

            <div
              id="vechai-map"
              className="w-full h-full md:rounded-2xl"
            />
          </div>
        </div>
      )}
      {mapData?.routeDistance && (
        <div className="absolute top-3 left-3 z-10 bg-white shadow-lg px-4 py-2 rounded-xl">
          🚗 {mapData.routeDistance} km
          ⏱ {mapData.eta} phút
        </div>
      )}
    </div>
  );
}