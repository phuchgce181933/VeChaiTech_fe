import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

export default function TradersAccepted() {
  const { user } = useContext(AuthContext);
  const token = user?.token;

  const [orders, setOrders] = useState([]);
  const [adminLocation, setAdminLocation] = useState(null);

  // ===== CANCEL STATES =====
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelFile, setCancelFile] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);

  /* ===================== GEO ===================== */
  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (pos) =>
        setAdminLocation({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        }),
      () => {}
    );
  }, []);

  /* ===================== FETCH ORDERS ===================== */
  useEffect(() => {
    if (!user?.id || !token) return;

    const fetchOrders = async () => {
      try {
        // 1️⃣ Lấy danh sách
        const listRes = await axios.get(
          `http://localhost:8080/api/v1/orders/recycler/${user.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const claimedOrders = (listRes.data.data || []).filter(
          (o) => o.status === "CLAIMED"
        );

        // 2️⃣ Gọi chi tiết từng đơn
        const detailRequests = claimedOrders.map((o) =>
          axios.get(`http://localhost:8080/api/v1/orders/${o.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
        );

        const detailResponses = await Promise.all(detailRequests);

        const fullOrders = detailResponses.map((res) => res.data.data);

        setOrders(fullOrders);
      } catch (err) {
        console.error("Fetch orders error:", err);
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

    const d = calculateDistance(
      adminLocation.latitude,
      adminLocation.longitude,
      Number(order.latitude),
      Number(order.longitude)
    );

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
        `http://localhost:8080/api/v1/orders/${selectedOrderId}/cancel`,
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
        `http://localhost:8080/api/v1/orders/${orderId}/status?status=COMPLETED`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setOrders((prev) => prev.filter((o) => o.id !== orderId));
    } catch {
      alert("Hoàn thành thất bại");
    }
  };

  /* ===================== UI ===================== */
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">🔄 Đơn hàng đã nhận</h1>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 text-center shadow">
          📭 Không có đơn đang xử lý
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const d = getDistanceInfo(order);

            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl border shadow-sm p-6 relative"
              >
                <div className="absolute left-0 top-0 h-full w-1 bg-blue-500 rounded-l-2xl" />

                <div className="flex justify-between mb-3">
                  <p className="font-semibold">Đơn #{order.id}</p>
                  <span className="text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-700">
                    CLAIMED
                  </span>
                </div>

                {/* DISTANCE */}
                {d && (
                  <div className="text-sm mb-2">
                    📍 Khoảng cách: <b>{d.distance} km</b>
                  </div>
                )}

                {/* WARNING */}
                {d?.warning && (
                  <div className="bg-orange-50 border border-orange-300 text-orange-800 rounded-xl p-4 mb-4 text-sm">
                    ⚠️ <b>Cảnh báo:</b> Đơn hàng cách bạn hơn 10km.  
                    <br />
                    Hãy cân nhắc trước khi tiếp tục giao đơn.
                  </div>
                )}

                {/* INFO */}
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400 text-xs">Khách hàng</p>
                    <p className="font-medium">{order.customerName}</p>
                  </div>

                  <div>
                    <p className="text-gray-400 text-xs">Số điện thoại</p>
                    <a
                      href={`tel:${order.customerPhone}`}
                      className="text-blue-600 font-semibold"
                    >
                      {order.customerPhone}
                    </a>
                  </div>

                  <div>
                    <p className="text-gray-400 text-xs">Loại rác</p>
                    <p className="font-medium">{order.wasteListingName}</p>
                  </div>
                </div>

                {/* ADDRESS */}
                <div className="mt-4 bg-gray-50 border rounded-xl p-4">
                  <p className="text-xs text-gray-400 mb-1">
                    📍 Địa chỉ chi tiết
                  </p>
                  <p className="font-semibold">{order.addressFull}</p>
                </div>

                {/* ACTIONS */}
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => completeOrder(order.id)}
                    className="px-4 py-2 rounded-xl bg-green-600 text-white"
                  >
                    ✔️ Hoàn thành
                  </button>
                  <button
                    onClick={() => openCancelModal(order.id)}
                    className="px-4 py-2 rounded-xl bg-red-600 text-white"
                  >
                    ❌ Hủy
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ===== CANCEL MODAL ===== */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
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
    </div>
  );
}
